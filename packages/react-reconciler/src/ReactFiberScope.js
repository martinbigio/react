/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactInternalTypes';
import type {
  ReactScopeInstance,
  ReactContext,
  ReactScopeQuery,
} from 'shared/ReactTypes';

import {
  getPublicInstance,
  getInstanceFromNode,
  getInstanceFromScope,
} from './ReactFiberConfig';
import {isFiberSuspenseAndTimedOut} from './ReactFiberTreeReflection';

import {HostComponent, ScopeComponent, ContextProvider} from './ReactWorkTags';
import {
  enableScopeAPI,
  enableRenderableContext,
} from 'shared/ReactFeatureFlags';

function getSuspenseFallbackChild(fiber: Fiber): Fiber | null {
  return ((((fiber[6]: any): Fiber)[7]: any): Fiber)[6];
}

const emptyObject = {};

function collectScopedNodes(
  node: Fiber,
  fn: ReactScopeQuery,
  scopedNodes: Array<any>,
): void {
  if (enableScopeAPI) {
    if (node[0] === HostComponent) {
      const type = node[3]; const memoizedProps = node[12]; const stateNode = node[4];
      const instance = getPublicInstance(stateNode);
      if (
        instance !== null &&
        fn(type, memoizedProps || emptyObject, instance) === true
      ) {
        scopedNodes.push(instance);
      }
    }
    let child = node[6];

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }
    if (child !== null) {
      collectScopedNodesFromChildren(child, fn, scopedNodes);
    }
  }
}

function collectFirstScopedNode(
  node: Fiber,
  fn: ReactScopeQuery,
): null | Object {
  if (enableScopeAPI) {
    if (node[0] === HostComponent) {
      const type = node[3]; const memoizedProps = node[12]; const stateNode = node[4];
      const instance = getPublicInstance(stateNode);
      if (instance !== null && fn(type, memoizedProps, instance) === true) {
        return instance;
      }
    }
    let child = node[6];

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }
    if (child !== null) {
      return collectFirstScopedNodeFromChildren(child, fn);
    }
  }
  return null;
}

function collectScopedNodesFromChildren(
  startingChild: Fiber,
  fn: ReactScopeQuery,
  scopedNodes: Array<any>,
): void {
  let child: null | Fiber = startingChild;
  while (child !== null) {
    collectScopedNodes(child, fn, scopedNodes);
    child = child[7];
  }
}

function collectFirstScopedNodeFromChildren(
  startingChild: Fiber,
  fn: ReactScopeQuery,
): Object | null {
  let child: null | Fiber = startingChild;
  while (child !== null) {
    const scopedNode = collectFirstScopedNode(child, fn);
    if (scopedNode !== null) {
      return scopedNode;
    }
    child = child[7];
  }
  return null;
}

function collectNearestContextValues<T>(
  node: Fiber,
  context: ReactContext<T>,
  childContextValues: Array<T>,
): void {
  if (
    node[0] === ContextProvider &&
    (enableRenderableContext ? node[3] : node[3]._context) === context
  ) {
    const contextValue = node[12].value;
    childContextValues.push(contextValue);
  } else {
    let child = node[6];

    if (isFiberSuspenseAndTimedOut(node)) {
      child = getSuspenseFallbackChild(node);
    }
    if (child !== null) {
      collectNearestChildContextValues(child, context, childContextValues);
    }
  }
}

function collectNearestChildContextValues<T>(
  startingChild: Fiber | null,
  context: ReactContext<T>,
  childContextValues: Array<T>,
): void {
  let child = startingChild;
  while (child !== null) {
    collectNearestContextValues(child, context, childContextValues);
    child = child[7];
  }
}

function DO_NOT_USE_queryAllNodes(
  this: $FlowFixMe,
  fn: ReactScopeQuery,
): null | Array<Object> {
  const currentFiber = getInstanceFromScope(this);
  if (currentFiber === null) {
    return null;
  }
  const child = currentFiber.child;
  const scopedNodes: Array<any> = [];
  if (child !== null) {
    collectScopedNodesFromChildren(child, fn, scopedNodes);
  }
  return scopedNodes.length === 0 ? null : scopedNodes;
}

function DO_NOT_USE_queryFirstNode(
  this: $FlowFixMe,
  fn: ReactScopeQuery,
): null | Object {
  const currentFiber = getInstanceFromScope(this);
  if (currentFiber === null) {
    return null;
  }
  const child = currentFiber.child;
  if (child !== null) {
    return collectFirstScopedNodeFromChildren(child, fn);
  }
  return null;
}

function containsNode(this: $FlowFixMe, node: Object): boolean {
  let fiber = getInstanceFromNode(node);
  while (fiber !== null) {
    if (fiber[0] === ScopeComponent && fiber[4] === this) {
      return true;
    }
    fiber = fiber[5];
  }
  return false;
}

function getChildContextValues<T>(
  this: $FlowFixMe,
  context: ReactContext<T>,
): Array<T> {
  const currentFiber = getInstanceFromScope(this);
  if (currentFiber === null) {
    return [];
  }
  const child = currentFiber.child;
  const childContextValues: Array<T> = [];
  if (child !== null) {
    collectNearestChildContextValues(child, context, childContextValues);
  }
  return childContextValues;
}

export function createScopeInstance(): ReactScopeInstance {
  return {
    DO_NOT_USE_queryAllNodes,
    DO_NOT_USE_queryFirstNode,
    containsNode,
    getChildContextValues,
  };
}
