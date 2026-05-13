const tA = new Date(`1970-01-01 11:00 am`).getTime();
const tB = new Date(`1970-01-01 05:00 pm`).getTime();
console.log('tA:', tA, 'tB:', tB);
console.log('Sort order correct:', tA < tB);
