import os

attributes = {
    "tag": 0,
    "key": 1,
    "elementType": 2,
    "type": 3,
    "stateNode": 4,
    "return": 5,
    "childLanes": 21,
    "child": 6,
    "sibling": 7,
    "index": 8,
    "refCleanup": 10,
    "ref": 9,
    "pendingProps": 11,
    "memoizedProps": 12,
    "updateQueue": 13,
    "memoizedState": 14,
    "dependencies": 15,
    "mode": 16,
    "flags": 17,
    "subtreeFlags": 18,
    "deletions": 19,
    "lanes": 20,
    "alternate": 22,
    "actualDuration": 23,
    "actualStartTime": 24,
    "selfBaseDuration": 25,
    "treeBaseDuration": 26,
    "_debugInfo": 27,
    "_debugOwner": 28,
    "_debugIsCurrentlyTiming": 29,
    "_debugNeedsRemount": 30,
    "_debugHookTypes": 31
}

def replace_in_directory(prefix):
    for attribute in attributes:
        cmd = f"find packages/react-reconciler -type f -exec gsed -i 's/{prefix}.{attribute}/{prefix}[{attributes[attribute]}]/g' {{}} \\;"
        os.system(cmd)

def replace_in_file(filename, prefix, prefix_replacement=None):
    if prefix_replacement is None:
        prefix_replacement = prefix
    for attribute in attributes:
        cmd = f"gsed -i 's/{prefix}.{attribute}/{prefix_replacement}[{attributes[attribute]}]/g' {filename}"
        os.system(cmd)

# REACT-RECONCILER
replace_in_directory("workInProgress")

replace_in_file("packages/react-reconciler/src/ReactFiber.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiber.js", "fiber")

replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "returnFiber")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "newFiber")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "existing")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "created")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "current")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "newChild")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "currentChild")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "child")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "currentFirstChild")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "previousNewFiber")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "oldFiber")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "existingChild")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "clone")
replace_in_file("packages/react-reconciler/src/ReactChildFiber.js", "childToDelete")

replace_in_file("packages/react-reconciler/src/ReactCurrentFiber.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberActivityComponent.js", "offscreenFiber")

replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "primaryChildFragment")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "row")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "oldWorkInProgress")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "newWorkInProgress")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "currentPrimaryChildFragment")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "fallbackChildFragment")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "alternate")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "currentChild")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "newChild")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "lastContentRow")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "returnFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "prevSibling")
replace_in_file("packages/react-reconciler/src/ReactFiberBeginWork.js", "node")

replace_in_file("packages/react-reconciler/src/ReactFiberClassComponent.js", "current")

replace_in_file("packages/react-reconciler/src/ReactFiberClassUpdateQueue.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberClassUpdateQueue.js", "current")

replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "parent")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "finishedWork")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "offscreenFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "abortedFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "parentFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "sibling")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "node\[7]", "node[7]")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "deletedFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "sibling")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "finishedWork\[22]", "finishedWork[22]")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "finishedWork\[5]", "finishedWork[5]")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "finishedWork\[6]", "finishedWork[6]")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "previousFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "detachedChild")
replace_in_file("packages/react-reconciler/src/ReactFiberCommitWork.js", "alternate")

replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "completedWork")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "tailNode")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "tail")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "offscreenFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "renderedTail")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "primaryChildFragment")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "node\[7]", "node[7]")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "lastTailNode")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "row")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "previousSibling")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "next")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "suspended")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "offscreenFiber\[22]", "offscreenFiber[22]")
replace_in_file("packages/react-reconciler/src/ReactFiberCompleteWork.js", "completedWork\[22]", "completedWork[22]")

replace_in_file("packages/react-reconciler/src/ReactFiberComponentStack.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberComponentStack.js", "node")

replace_in_file("packages/react-reconciler/src/ReactFiberConcurrentUpdates.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberConcurrentUpdates.js", "sourceFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberConcurrentUpdates.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberConcurrentUpdates.js", "alternate")
replace_in_file("packages/react-reconciler/src/ReactFiberConcurrentUpdates.js", "parent")

replace_in_file("packages/react-reconciler/src/ReactFiberContext.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberContext.js", "node")

replace_in_file("packages/react-reconciler/src/ReactFiberDevToolsHook.js", "current")

replace_in_file("packages/react-reconciler/src/ReactFiberErrorLogger.js", "boundary")

replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "currentlyRenderingFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "formFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "provider")
replace_in_file("packages/react-reconciler/src/ReactFiberHooks.js", "alternate")

replace_in_file("packages/react-reconciler/src/ReactFiberHostContext.js", "fiber")

replace_in_file("packages/react-reconciler/src/ReactFiberHotReloading.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHotReloading.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberHotReloading.js", "node\[6]", "node[6]")
replace_in_file("packages/react-reconciler/src/ReactFiberHotReloading.js", "node\[7]", "node[7]")

replace_in_file("packages/react-reconciler/src/ReactFiberHydrationContext.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHydrationContext.js", "returnFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHydrationContext.js", "hydrationParentFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHydrationContext.js", "dehydratedFragment")

replace_in_file("packages/react-reconciler/src/ReactFiberHydrationDiffs.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberHydrationDiffs.js", "childFiber")

replace_in_file("packages/react-reconciler/src/ReactFiberLane.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberLane.js", "root.current")

replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "parent")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "consumer")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "nextFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "currentParent")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "parentSuspense")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "alternate")
replace_in_file("packages/react-reconciler/src/ReactFiberNewContext.js", "sibling")

replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "containerFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "hostFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "containerFiber.child")
replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "fiber\[22]", "fiber[22]")
replace_in_file("packages/react-reconciler/src/ReactFiberReconciler.js", "containerFiber\[6]", "containerFiber[6]")

replace_in_file("packages/react-reconciler/src/ReactFiberRoot.js", "uninitializedFiber")

replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "uninitializedFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "((fiber\[6]: any): Fiber)", "((fiber[6]: any): Fiber)")
replace_in_file("packages/react-reconciler/src/ReactFiberScope.js", "((((fiber\[6]: any): Fiber)\[7]: any): Fiber)", "((((fiber[6]: any): Fiber)[7]: any): Fiber)")

replace_in_file("packages/react-reconciler/src/ReactFiberShellHydration.js", "root.current")

replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseComponent.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseComponent.js", "node\[6]", "node[6]")
replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseComponent.js", "node\[7]", "node[7]")

replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseContext.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseContext.js", "handler")
replace_in_file("packages/react-reconciler/src/ReactFiberSuspenseContext.js", "current")

replace_in_file("packages/react-reconciler/src/ReactFiberThrow.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberThrow.js", "sourceFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberThrow.js", "currentSource")
replace_in_file("packages/react-reconciler/src/ReactFiberThrow.js", "suspenseBoundary")


replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "parentFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "a")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "b")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "parentA")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "parentB")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "owner")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "ownerFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberTreeReflection.js", "current")

replace_in_file("packages/react-reconciler/src/ReactFiberUnwindWork.js", "interruptedWork")

replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "hostFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "unitOfWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "completedWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "finishedWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "current")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "suspenseHandler")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "node")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "child")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "interruptedWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "erroredWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "incompleteWork")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "sourceFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "rootFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "boundaryFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "returnFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "node\[7]", "node[7]")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "rootWorkInProgress")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "parentFiber")
replace_in_file("packages/react-reconciler/src/ReactFiberWorkLoop.js", "next")

replace_in_file("packages/react-reconciler/src/ReactProfilerTimer.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactProfilerTimer.js", "parentFiber")
replace_in_file("packages/react-reconciler/src/ReactProfilerTimer.js", "child")

replace_in_file("packages/react-reconciler/src/ReactStrictModeWarnings.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactStrictModeWarnings.js", "node")

replace_in_file("packages/react-reconciler/src/ReactTestSelectors.js", "fiber")
replace_in_file("packages/react-reconciler/src/ReactTestSelectors.js", "node")
replace_in_file("packages/react-reconciler/src/ReactTestSelectors.js", "child")

# REACT_REFRESH 
replace_in_file("packages/react-refresh/src/ReactFreshRuntime.js", "current")
replace_in_file("packages/react-refresh/src/ReactFreshRuntime.js", "alternate")

# REACT-NATIVE-RENDERER
replace_in_file("packages/react-native-renderer/src/ReactFabricComponentTree.js", "fiber")

replace_in_file("packages/react-native-renderer/src/ReactFabricEventEmitter.js", "targetFiber")

replace_in_file("packages/react-native-renderer/src/ReactNativeFiberInspector.js", "host")
replace_in_file("packages/react-native-renderer/src/ReactNativeFiberInspector.js", "hostFiber")
replace_in_file("packages/react-native-renderer/src/ReactNativeFiberInspector.js", "fiber")
replace_in_file("packages/react-native-renderer/src/ReactNativeFiberInspector.js", "instance")
replace_in_file("packages/react-native-renderer/src/ReactNativeFiberInspector.js", "owner")

replace_in_file("packages/react-native-renderer/src/ReactNativeGetListener.js", "inst")

replace_in_file("packages/react-native-renderer/src/ReactNativePublicCompat.js", "owner")

# REACT-DEBUG-TOOLS 
replace_in_file("packages/react-debug-tools/src/ReactDebugHooks.js", "current")
replace_in_file("packages/react-debug-tools/src/ReactDebugHooks.js", "fiber")
replace_in_file("packages/react-debug-tools/src/ReactDebugHooks.js", "currentFiber")


# other fixes
os.system(f"gsed -i 's/{'const {tag, type} = fiber;'}/{'const tag = fiber[0];const type = fiber[3];'}/g' {'packages/react-reconciler/src/getComponentNameFromFiber.js'}")
os.system(f"gsed -i 's/{'const {tag} = node;'}/{'const tag = node[0];'}/g' {'packages/react-reconciler/src/ReactFiberCommitWork.js'}")

os.system(f"gsed -i 's/{'const {child, sibling, tag, type} = fiber;'}/{'const child = fiber[6]; const sibling = fiber[7]; const tag = fiber[0]; const type = fiber[3];'}/g' {'packages/react-reconciler/src/ReactFiberHotReloading.js'}")
os.system(f"gsed -i 's/{'const {alternate, child, sibling, tag, type} = fiber;'}/{'const alternate = fiber[22]; const child = fiber[6]; const sibling = fiber[7]; const tag = fiber[0]; const type = fiber[3];'}/g' {'packages/react-reconciler/src/ReactFiberHotReloading.js'}")

os.system(f"gsed -i 's/{'const {type, memoizedProps, stateNode} = node;'}/{'const type = node[3]; const memoizedProps = node[12]; const stateNode = node[4];'}/g' {'packages/react-reconciler/src/ReactFiberScope.js'}")
