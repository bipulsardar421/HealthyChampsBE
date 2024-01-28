export const removeDuplicates = (arr: any, checkValue: string) => {
    const uniqueIds = [];
     return arr.filter(element => {
        const isDuplicate = uniqueIds.includes(element[checkValue]);
      
        if (!isDuplicate) {
          uniqueIds.push(element[checkValue]);
      
          return true;
        }
      
        return false;
      });

      
  }