replace() {
    prefix=$1
    attributes=("tag" "key" "elementType" "type" "stateNode" "return" "child" "sibling" "index" "ref" "refCleanup" "pendingProps" "memoizedProps" "updateQueue" "memoizedState" "dependencies" "mode" "flags" "subtreeFlags" "deletions" "lanes" "childLanes" "alternate" "actualDuration" "actualStartTime" "selfBaseDuration" "treeBaseDuration" "_debugInfo" "_debugOwner" "_debugIsCurrentlyTiming" "_debugNeedsRemount" "_debugHookTypes")
    attributeOrder=0
    for attribute in "${attributes[@]}"; do
        find packages/react-reconciler -type f -exec gsed -i "s/${prefix}.${attribute}/${prefix}[${attributeOrder}]/g" {} \;
        let attributeOrder++
    done
}

replace "workInProgress"

# find . -type f -exec gsed -i 's/primaryChildFragment[21]/primaryChildFragment[21]/g' {} \;