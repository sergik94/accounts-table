export const getYearsArray = (dataArr: string[]) => {
  let min = 3000;
  let max = 0;

  for (let i = 0; i < dataArr.length; i++) {
    const year = +dataArr[i].split('-')[2];

    if (year < min) {
      min = year;
    }

    if (year > max) {
      max = year;
    }
  }

  const yearsArr = [];

  for (let i = min; i <= max; i++) {
    yearsArr.push(i + '');
  }

  return yearsArr;
};
