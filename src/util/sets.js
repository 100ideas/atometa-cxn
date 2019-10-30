// thanks, mozilla!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

function isSuperset(set, subset) {
  for (var elem of subset) {
      if (!set.has(elem)) {
          return false;
      }
  }
  return true;
}

function union(setA, setB) {
  var _union = new Set(setA);
  for (var elem of setB) {
      _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  var _intersection = new Set();
  for (var elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem);
      }
  }
  return _intersection;
}

function symmetricDifference(setA, setB) {
  var _difference = new Set(setA);
  for (var elem of setB) {
      if (_difference.has(elem)) {
          _difference.delete(elem);
      } else {
          _difference.add(elem);
      }
  }
  return _difference;
}

function difference(setA, setB) {
  var _difference = new Set(setA);
  for (var elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}

//Examples
// var setA = new Set([1, 2, 3, 4]),
//   setB = new Set([2, 3]),
//   setC = new Set([3, 4, 5, 6]);

// isSuperset(setA, setB); // => true
// union(setA, setC); // => Set [1, 2, 3, 4, 5, 6]
// intersection(setA, setC); // => Set [3, 4]
// symmetricDifference(setA, setC); // => Set [1, 2, 5, 6]
// difference(setA, setC); // => Set [1, 2]