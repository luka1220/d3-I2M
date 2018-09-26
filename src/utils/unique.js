
/**
* uniqueUnion function for Ideas from Insperations
* to merge conzepts
**/
export const uniqueUnion = (arrArg1, arrArg2) => {
  console.log(arrArg1,arrArg2)
  var arrfil = arrArg1.filter((elem, pos, arr) => {
    return !arrArg2.some((e)=>{
 		return elem.selectedConceptURI === e.selectedConceptURI
    })
  })
  console.log(arrfil)
  return arrArg2.concat(arrfil)
}