/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {ReactContext} from 'shared/ReactTypes';
import type {
  Fiber,
  ContextDependency,
  Dependencies,
} from './ReactInternalTypes';
import type {StackCursor} from './ReactFiberStack';
import type {Lanes} from './ReactFiberLane';
import type {SharedQueue} from './ReactFiberClassUpdateQueue';
import type {TransitionStatus} from './ReactFiberConfig';
import type {Hook} from './ReactFiberHooks';

import {isPrimaryRenderer} from './ReactFiberConfig';
import {createCursor, push, pop} from './ReactFiberStack';
import {
  ContextProvider,
  ClassComponent,
  DehydratedFragment,
} from './ReactWorkTags';
import {
  NoLanes,
  isSubsetOfLanes,
  includesSomeLane,
  mergeLanes,
  pickArbitraryLane,
} from './ReactFiberLane';
import {
  NoFlags,
  DidPropagateContext,
  NeedsPropagation,
} from './ReactFiberFlags';

import is from 'shared/objectIs';
import {createUpdate, ForceUpdate} from './ReactFiberClassUpdateQueue';
import {markWorkInProgressReceivedUpdate} from './ReactFiberBeginWork';
import {
  enableLazyContextPropagation,
  enableAsyncActions,
  enableRenderableContext,
} from 'shared/ReactFeatureFlags';
import {
  getHostTransitionProvider,
  HostTransitionContext,
} from './ReactFiberHostContext';

const valueCursor: StackCursor<mixed> = createCursor(null);

let rendererCursorDEV: StackCursor<Object | null>;
if (__DEV__) {
  rendererCursorDEV = createCursor(null);
}
let renderer2CursorDEV: StackCursor<Object | null>;
if (__DEV__) {
  renderer2CursorDEV = createCursor(null);
}

let rendererSigil;
if (__DEV__) {
  // Use this to detect multiple renderers using the same context
  rendererSigil = {};
}

let currentlyRenderingFiber: Fiber | null = null;
let lastContextDependency: ContextDependency<mixed> | null = null;
let lastFullyObservedContext: ReactContext<any> | null = null;

let isDisallowedContextReadInDEV: boolean = false;

export function resetContextDependencies(): void {
  // This is called right before React yields execution, to ensure `readContext`
  // cannot be called outside the render phase.
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastFullyObservedContext = null;
  if (__DEV__) {
    isDisallowedContextReadInDEV = false;
  }
}

export function enterDisallowedContextReadInDEV(): void {
  if (__DEV__) {
    isDisallowedContextReadInDEV = true;
  }
}

export function exitDisallowedContextReadInDEV(): void {
  if (__DEV__) {
    isDisallowedContextReadInDEV = false;
  }
}

export function pushProvider<T>(
  providerFiber: Fiber,
  context: ReactContext<T>,
  nextValue: T,
): void {
  if (isPrimaryRenderer) {
    push(valueCursor, context._currentValue, providerFiber);

    context._currentValue = nextValue;
    if (__DEV__) {
      push(rendererCursorDEV, context._currentRenderer, providerFiber);

      if (
        context._currentRenderer !== undefined &&
        context._currentRenderer !== null &&
        context._currentRenderer !== rendererSigil
      ) {
        console.error(
          'Detected multiple renderers concurrently rendering the ' +
            'same context provider. This is currently unsupported.',
        );
      }
      context._currentRenderer = rendererSigil;
    }
  } else {
    push(valueCursor, context._currentValue2, providerFiber);

    context._currentValue2 = nextValue;
    if (__DEV__) {
      push(renderer2CursorDEV, context._currentRenderer2, providerFiber);

      if (
        context._currentRenderer2 !== undefined &&
        context._currentRenderer2 !== null &&
        context._currentRenderer2 !== rendererSigil
      ) {
        console.error(
          'Detected multiple renderers concurrently rendering the ' +
            'same context provider. This is currently unsupported.',
        );
      }
      context._currentRenderer2 = rendererSigil;
    }
  }
}

export function popProvider(
  context: ReactContext<any>,
  providerFiber: Fiber,
): void {
  const currentValue = valueCursor.current;

  if (isPrimaryRenderer) {
    context._currentValue = currentValue;
    if (__DEV__) {
      const currentRenderer = rendererCursorDEV.current;
      pop(rendererCursorDEV, providerFiber);
      context._currentRenderer = currentRenderer;
    }
  } else {
    context._currentValue2 = currentValue;
    if (__DEV__) {
      const currentRenderer2 = renderer2CursorDEV.current;
      pop(renderer2CursorDEV, providerFiber);
      context._currentRenderer2 = currentRenderer2;
    }
  }

  pop(valueCursor, providerFiber);
}

export function scheduleContextWorkOnParentPath(
  parent: Fiber | null,
  renderLanes: Lanes,
  propagationRoot: Fiber,
) {
  // Update the child lanes of all the ancestors, including the alternates.
  let node = parent;
  while (node !== null) {
    const alternate = node[22];
    if (!isSubsetOfLanes(node[21], renderLanes)) {
      node[21] = mergeLanes(node[21], renderLanes);
      if (alternate !== null) {
        alternate[21] = mergeLanes(alternate[21], renderLanes);
      }
    } else if (
      alternate !== null &&
      !isSubsetOfLanes(alternate[21], renderLanes)
    ) {
      alternate[21] = mergeLanes(alternate[21], renderLanes);
    } else {
      // Neither alternate was updated.
      // Normally, this would mean that the rest of the
      // ancestor path already has sufficient priority.
      // However, this is not necessarily true inside offscreen
      // or fallback trees because childLanes may be inconsistent
      // with the surroundings. This is why we continue the loop.
    }
    if (node === propagationRoot) {
      break;
    }
    node = node[5];
  }
  if (__DEV__) {
    if (node !== propagationRoot) {
      console.error(
        'Expected to find the propagation root when scheduling context work. ' +
          'This error is likely caused by a bug in React. Please file an issue.',
      );
    }
  }
}

export function propagateContextChange<T>(
  workInProgress: Fiber,
  context: ReactContext<T>,
  renderLanes: Lanes,
): void {
  if (enableLazyContextPropagation) {
    // TODO: This path is only used by Cache components. Update
    // lazilyPropagateParentContextChanges to look for Cache components so they
    // can take advantage of lazy propagation.
    const forcePropagateEntireTree = true;
    propagateContextChanges(
      workInProgress,
      [context],
      renderLanes,
      forcePropagateEntireTree,
    );
  } else {
    propagateContextChange_eager(workInProgress, context, renderLanes);
  }
}

function propagateContextChange_eager<T>(
  workInProgress: Fiber,
  context: ReactContext<T>,
  renderLanes: Lanes,
): void {
  // Only used by eager implementation
  if (enableLazyContextPropagation) {
    return;
  }
  let fiber = workInProgress[6];
  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber[5] = workInProgress;
  }
  while (fiber !== null) {
    let nextFiber;

    // Visit this fiber.
    const list = fiber[15];
    if (list !== null) {
      nextFiber = fiber[6];

      let dependency = list.firstContext;
      while (dependency !== null) {
        // Check if the context matches.
        if (dependency.context === context) {
          // Match! Schedule an update on this fiber.
          if (fiber[0] === ClassComponent) {
            // Schedule a force update on the work-in-progress.
            const lane = pickArbitraryLane(renderLanes);
            const update = createUpdate(lane);
            update.tag = ForceUpdate;
            // TODO: Because we don't have a work-in-progress, this will add the
            // update to the current fiber, too, which means it will persist even if
            // this render is thrown away. Since it's a race condition, not sure it's
            // worth fixing.

            // Inlined `enqueueUpdate` to remove interleaved update check
            const updateQueue = fiber[13];
            if (updateQueue === null) {
              // Only occurs if the fiber has been unmounted.
            } else {
              const sharedQueue: SharedQueue<any> = (updateQueue: any).shared;
              const pending = sharedQueue.pending;
              if (pending === null) {
                // This is the first update. Create a circular list.
                update.next = update;
              } else {
                update.next = pending.next;
                pending.next = update;
              }
              sharedQueue.pending = update;
            }
          }

          fiber[20] = mergeLanes(fiber[20], renderLanes);
          const alternate = fiber[22];
          if (alternate !== null) {
            alternate[20] = mergeLanes(alternate[20], renderLanes);
          }
          scheduleContextWorkOnParentPath(
            fiber[5],
            renderLanes,
            workInProgress,
          );

          // Mark the updated lanes on the list, too.
          list.lanes = mergeLanes(list.lanes, renderLanes);

          // Since we already found a match, we can stop traversing the
          // dependency list.
          break;
        }
        dependency = dependency.next;
      }
    } else if (fiber[0] === ContextProvider) {
      // Don't scan deeper if this is a matching provider
      nextFiber = fiber[3] === workInProgress[3] ? null : fiber[6];
    } else if (fiber[0] === DehydratedFragment) {
      // If a dehydrated suspense boundary is in this subtree, we don't know
      // if it will have any context consumers in it. The best we can do is
      // mark it as having updates.
      const parentSuspense = fiber[5];

      if (parentSuspense === null) {
        throw new Error(
          'We just came from a parent so we must have had a parent. This is a bug in React.',
        );
      }

      parentSuspense[20] = mergeLanes(parentSuspense[20], renderLanes);
      const alternate = parentSuspense[22];
      if (alternate !== null) {
        alternate[20] = mergeLanes(alternate[20], renderLanes);
      }
      // This is intentionally passing this fiber as the parent
      // because we want to schedule this fiber as having work
      // on its children. We'll use the childLanes on
      // this fiber to indicate that a context has changed.
      scheduleContextWorkOnParentPath(
        parentSuspense,
        renderLanes,
        workInProgress,
      );
      nextFiber = fiber[7];
    } else {
      // Traverse down.
      nextFiber = fiber[6];
    }

    if (nextFiber !== null) {
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber[5] = fiber;
    } else {
      // No child. Traverse to next sibling.
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }
        const sibling = nextFiber[7];
        if (sibling !== null) {
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling[5] = nextFiber[5];
          nextFiber = sibling;
          break;
        }
        // No more siblings. Traverse up.
        nextFiber = nextFiber[5];
      }
    }
    fiber = nextFiber;
  }
}

function propagateContextChanges<T>(
  workInProgress: Fiber,
  contexts: Array<any>,
  renderLanes: Lanes,
  forcePropagateEntireTree: boolean,
): void {
  // Only used by lazy implementation
  if (!enableLazyContextPropagation) {
    return;
  }
  let fiber = workInProgress[6];
  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber[5] = workInProgress;
  }
  while (fiber !== null) {
    let nextFiber;

    // Visit this fiber.
    const list = fiber[15];
    if (list !== null) {
      nextFiber = fiber[6];

      let dep = list.firstContext;
      findChangedDep: while (dep !== null) {
        // Assigning these to constants to help Flow
        const dependency = dep;
        const consumer = fiber;
        findContext: for (let i = 0; i < contexts.length; i++) {
          const context: ReactContext<T> = contexts[i];
          // Check if the context matches.
          // TODO: Compare selected values to bail out early.
          if (dependency.context === context) {
            // Match! Schedule an update on this fiber.

            // In the lazy implementation, don't mark a dirty flag on the
            // dependency itself. Not all changes are propagated, so we can't
            // rely on the propagation function alone to determine whether
            // something has changed; the consumer will check. In the future, we
            // could add back a dirty flag as an optimization to avoid double
            // checking, but until we have selectors it's not really worth
            // the trouble.
            consumer[20] = mergeLanes(consumer[20], renderLanes);
            const alternate = consumer[22];
            if (alternate !== null) {
              alternate[20] = mergeLanes(alternate[20], renderLanes);
            }
            scheduleContextWorkOnParentPath(
              consumer[5],
              renderLanes,
              workInProgress,
            );

            if (!forcePropagateEntireTree) {
              // During lazy propagation, when we find a match, we can defer
              // propagating changes to the children, because we're going to
              // visit them during render. We should continue propagating the
              // siblings, though
              nextFiber = null;
            }

            // Since we already found a match, we can stop traversing the
            // dependency list.
            break findChangedDep;
          }
        }
        dep = dependency.next;
      }
    } else if (fiber[0] === DehydratedFragment) {
      // If a dehydrated suspense boundary is in this subtree, we don't know
      // if it will have any context consumers in it. The best we can do is
      // mark it as having updates.
      const parentSuspense = fiber[5];

      if (parentSuspense === null) {
        throw new Error(
          'We just came from a parent so we must have had a parent. This is a bug in React.',
        );
      }

      parentSuspense[20] = mergeLanes(parentSuspense[20], renderLanes);
      const alternate = parentSuspense[22];
      if (alternate !== null) {
        alternate[20] = mergeLanes(alternate[20], renderLanes);
      }
      // This is intentionally passing this fiber as the parent
      // because we want to schedule this fiber as having work
      // on its children. We'll use the childLanes on
      // this fiber to indicate that a context has changed.
      scheduleContextWorkOnParentPath(
        parentSuspense,
        renderLanes,
        workInProgress,
      );
      nextFiber = null;
    } else {
      // Traverse down.
      nextFiber = fiber[6];
    }

    if (nextFiber !== null) {
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber[5] = fiber;
    } else {
      // No child. Traverse to next sibling.
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }
        const sibling = nextFiber[7];
        if (sibling !== null) {
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling[5] = nextFiber[5];
          nextFiber = sibling;
          break;
        }
        // No more siblings. Traverse up.
        nextFiber = nextFiber[5];
      }
    }
    fiber = nextFiber;
  }
}

export function lazilyPropagateParentContextChanges(
  current: Fiber,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  const forcePropagateEntireTree = false;
  propagateParentContextChanges(
    current,
    workInProgress,
    renderLanes,
    forcePropagateEntireTree,
  );
}

// Used for propagating a deferred tree (Suspense, Offscreen). We must propagate
// to the entire subtree, because we won't revisit it until after the current
// render has completed, at which point we'll have lost track of which providers
// have changed.
export function propagateParentContextChangesToDeferredTree(
  current: Fiber,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  const forcePropagateEntireTree = true;
  propagateParentContextChanges(
    current,
    workInProgress,
    renderLanes,
    forcePropagateEntireTree,
  );
}

function propagateParentContextChanges(
  current: Fiber,
  workInProgress: Fiber,
  renderLanes: Lanes,
  forcePropagateEntireTree: boolean,
) {
  if (!enableLazyContextPropagation) {
    return;
  }

  // Collect all the parent providers that changed. Since this is usually small
  // number, we use an Array instead of Set.
  let contexts = null;
  let parent: null | Fiber = workInProgress;
  let isInsidePropagationBailout = false;
  while (parent !== null) {
    if (!isInsidePropagationBailout) {
      if ((parent[17] & NeedsPropagation) !== NoFlags) {
        isInsidePropagationBailout = true;
      } else if ((parent[17] & DidPropagateContext) !== NoFlags) {
        break;
      }
    }

    if (parent[0] === ContextProvider) {
      const currentParent = parent[22];

      if (currentParent === null) {
        throw new Error('Should have a current fiber. This is a bug in React.');
      }

      const oldProps = currentParent[12];
      if (oldProps !== null) {
        let context: ReactContext<any>;
        if (enableRenderableContext) {
          context = parent[3];
        } else {
          context = parent[3]._context;
        }

        const newProps = parent[11];
        const newValue = newProps.value;

        const oldValue = oldProps.value;

        if (!is(newValue, oldValue)) {
          if (contexts !== null) {
            contexts.push(context);
          } else {
            contexts = [context];
          }
        }
      }
    } else if (enableAsyncActions && parent === getHostTransitionProvider()) {
      // During a host transition, a host component can act like a context
      // provider. E.g. in React DOM, this would be a <form />.
      const currentParent = parent[22];
      if (currentParent === null) {
        throw new Error('Should have a current fiber. This is a bug in React.');
      }

      const oldStateHook: Hook = currentParent[14];
      const oldState: TransitionStatus = oldStateHook.memoizedState;

      const newStateHook: Hook = parent[14];
      const newState: TransitionStatus = newStateHook.memoizedState;

      // This uses regular equality instead of Object.is because we assume that
      // host transition state doesn't include NaN as a valid type.
      if (oldState !== newState) {
        if (contexts !== null) {
          contexts.push(HostTransitionContext);
        } else {
          contexts = [HostTransitionContext];
        }
      }
    }
    parent = parent[5];
  }

  if (contexts !== null) {
    // If there were any changed providers, search through the children and
    // propagate their changes.
    propagateContextChanges(
      workInProgress,
      contexts,
      renderLanes,
      forcePropagateEntireTree,
    );
  }

  // This is an optimization so that we only propagate once per subtree. If a
  // deeply nested child bails out, and it calls this propagation function, it
  // uses this flag to know that the remaining ancestor providers have already
  // been propagated.
  //
  // NOTE: This optimization is only necessary because we sometimes enter the
  // begin phase of nodes that don't have any work scheduled on them —
  // specifically, the siblings of a node that _does_ have scheduled work. The
  // siblings will bail out and call this function again, even though we already
  // propagated content changes to it and its subtree. So we use this flag to
  // mark that the parent providers already propagated.
  //
  // Unfortunately, though, we need to ignore this flag when we're inside a
  // tree whose context propagation was deferred — that's what the
  // `NeedsPropagation` flag is for.
  //
  // If we could instead bail out before entering the siblings' begin phase,
  // then we could remove both `DidPropagateContext` and `NeedsPropagation`.
  // Consider this as part of the next refactor to the fiber tree structure.
  workInProgress[17] |= DidPropagateContext;
}

export function checkIfContextChanged(
  currentDependencies: Dependencies,
): boolean {
  if (!enableLazyContextPropagation) {
    return false;
  }
  // Iterate over the current dependencies to see if something changed. This
  // only gets called if props and state has already bailed out, so it's a
  // relatively uncommon path, except at the root of a changed subtree.
  // Alternatively, we could move these comparisons into `readContext`, but
  // that's a much hotter path, so I think this is an appropriate trade off.
  let dependency = currentDependencies.firstContext;
  while (dependency !== null) {
    const context = dependency.context;
    const newValue = isPrimaryRenderer
      ? context._currentValue
      : context._currentValue2;
    const oldValue = dependency.memoizedValue;
    if (!is(newValue, oldValue)) {
      return true;
    }
    dependency = dependency.next;
  }
  return false;
}

export function prepareToReadContext(
  workInProgress: Fiber,
  renderLanes: Lanes,
): void {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastFullyObservedContext = null;

  const dependencies = workInProgress[15];
  if (dependencies !== null) {
    if (enableLazyContextPropagation) {
      // Reset the work-in-progress list
      dependencies.firstContext = null;
    } else {
      const firstContext = dependencies.firstContext;
      if (firstContext !== null) {
        if (includesSomeLane(dependencies.lanes, renderLanes)) {
          // Context list has a pending update. Mark that this fiber performed work.
          markWorkInProgressReceivedUpdate();
        }
        // Reset the work-in-progress list
        dependencies.firstContext = null;
      }
    }
  }
}

export function readContext<T>(context: ReactContext<T>): T {
  if (__DEV__) {
    // This warning would fire if you read context inside a Hook like useMemo.
    // Unlike the class check below, it's not enforced in production for perf.
    if (isDisallowedContextReadInDEV) {
      console.error(
        'Context can only be read while React is rendering. ' +
          'In classes, you can read it in the render method or getDerivedStateFromProps. ' +
          'In function components, you can read it directly in the function body, but not ' +
          'inside Hooks like useReducer() or useMemo().',
      );
    }
  }
  return readContextForConsumer(currentlyRenderingFiber, context);
}

export function readContextDuringReconciliation<T>(
  consumer: Fiber,
  context: ReactContext<T>,
  renderLanes: Lanes,
): T {
  if (currentlyRenderingFiber === null) {
    prepareToReadContext(consumer, renderLanes);
  }
  return readContextForConsumer(consumer, context);
}

function readContextForConsumer<T>(
  consumer: Fiber | null,
  context: ReactContext<T>,
): T {
  const value = isPrimaryRenderer
    ? context._currentValue
    : context._currentValue2;

  if (lastFullyObservedContext === context) {
    // Nothing to do. We already observe everything in this context.
  } else {
    const contextItem = {
      context: ((context: any): ReactContext<mixed>),
      memoizedValue: value,
      next: null,
    };

    if (lastContextDependency === null) {
      if (consumer === null) {
        throw new Error(
          'Context can only be read while React is rendering. ' +
            'In classes, you can read it in the render method or getDerivedStateFromProps. ' +
            'In function components, you can read it directly in the function body, but not ' +
            'inside Hooks like useReducer() or useMemo().',
        );
      }

      // This is the first dependency for this component. Create a new list.
      lastContextDependency = contextItem;
      consumer[15] = {
        lanes: NoLanes,
        firstContext: contextItem,
      };
      if (enableLazyContextPropagation) {
        consumer[17] |= NeedsPropagation;
      }
    } else {
      // Append a new context item.
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }
  return value;
}
