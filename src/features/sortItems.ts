import { Account } from '../types/Accounts';
import { Campaign } from '../types/Campaign';
import { Profile } from '../types/Profile';

export function sortItems(
  items: (Account | Profile | Campaign)[],
  sortBy: string | null,
  order: string | null,
): (Account | Profile | Campaign)[] {
  const copyArr = [...items];

  function compareNumberType(prop1: number, prop2: number): number {
    if (order === 'desc') {
      return prop2 - prop1;
    }

    return prop1 - prop2;
  }

  if (sortBy) {
    copyArr.sort((item1, item2): number => {
      if (typeof item1[sortBy] === 'string') {
        let prop1 = item1[sortBy] as string;
        let prop2 = item2[sortBy] as string;

        if (sortBy === 'date' || sortBy === 'creationDate') {
          prop1 = prop1.split('-').reverse().join('-');
          prop2 = prop2.split('-').reverse().join('-');
        }
        if (order === 'desc') {
          return prop2.localeCompare(prop1);
        }

        return prop1.localeCompare(prop2);
      }

      if (typeof item1[sortBy] === 'number') {
        const prop1 = item1[sortBy] as number;
        const prop2 = item2[sortBy] as number;

        return compareNumberType(prop1, prop2);
      }

      return 0;
    });
  }

  return copyArr;
}
