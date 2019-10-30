import nanoid from 'nanoid/generate';

// https://medium.com/jsguru/javascript-functional-programming-map-filter-and-reduce-846ff9ba492d
export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
export const pipe    = (...fns) => x => fns.reduce(     (v, f) => f(v), x);

//// array utilities //////////////////////////////////////////////////////////
export const countUniqueElements    = arr => new Set(arr).size  
export const countDuplicateElements = arr => arr.length - new Set(arr).size // inclusive count
export const countIdenticalElements = arr => {
  if (arr.length < 2 ) return arr.length
  let duplicates = countDuplicateElements(arr)
  return duplicates + 1
}



const noLookAlikeDictLower = '23456789abcdefghijkmnpqrstwxyz'
export function generateShortNanoId( length = 8 ) {
  return nanoid( noLookAlikeDictLower, length )
}





////////////////////////////////////////////////////////////////////////////////
// archive of old approaches ///////////////////////////////////////////////////
//
// ... duh
//
// export const areAllElementsIdentical = arr => 
//   !!arr.reduce( 
//     (lastElem, currElem, idx) => {
//       if (idx === 0) return currElem // init accumulator w/ first array element
//       return lastElem && lastElem === currElem ? currElem : false // shallow identity
//     }, '')

// export const countUniqueElements = arr => 
//     pipe(
//       getMimeBases,
//       _arr => _arr.filter( curr => curr === _arr[0] ),
//       _arr => arr.length - _arr.length
//     )