import {useFilter} from '../store/FilterStore';
import {supabase} from '../supabase/supabase.config';

export async function createItem(item: Item) {
  return await supabase.from('items').insert([{...item, date: new Date()}]);
}

export async function getRecentItems() {
  try {
    const {data, error} = await supabase
      .from('items')
      .select(`*,users (id,fullName,image)`)
      .order('id', {ascending: false})
      .limit(10);

    if (error) throw new Error(error.message);
    // console.log(data);

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
const priceFilterMap = [
  {
    min: 1,
    max: 100,
  },
  {
    min: 100,
    max: 500,
  },
  {
    min: 500,
    max: 1000,
  },
  {
    min: 1000,
    max: 10000,
  },
];

export async function getAllItems(search: string = '') {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1

    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0),
    ); // Set to the first day of the current month
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999),
    ); // Set to the last day of the current month

    const filter = useFilter.getState().filter;
    const filterByUser = filter?.user ?? null;
    const filterByCategory = filter?.category ?? null;
    const filterByPrice = filter?.price ?? null;

    let query = supabase
      .from('items')
      .select(`*,users (id,fullName,image)`)
      .order('id', {ascending: false})
      .filter('createdAt', 'gte', startOfMonth.toISOString())
      .filter('createdAt', 'lte', endOfMonth.toISOString());

    if (filterByUser) {
      query = query.eq('userId', filterByUser);
    }
    if (filterByCategory) {
      query = query.eq('categoryId', filterByCategory);
    }
    if (filterByPrice) {
      query = query.gte('price', priceFilterMap[filterByPrice - 1].min);
      query = query.lt('price', priceFilterMap[filterByPrice - 1].max);
    }
    if (search) {
      query = query.ilike('description', `%${search}%`);
    }

    const {data, error} = await query;
    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const formatTimestamp = (timestamp: string) => {
  const dateSupabase = new Date(timestamp);

  // Get the timezone offset in minutes
  const timezoneOffset = dateSupabase.getTimezoneOffset();

  // Adjust the time to your local time by adding the timezone offset
  const dateLocal = new Date(
    dateSupabase.getTime() - timezoneOffset * 60 * 1000,
  );

  // Month names array for conversion
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const hours = String(dateLocal.getUTCHours()).padStart(2, '0');
  const minutes = String(dateLocal.getUTCMinutes()).padStart(2, '0');
  const day = String(dateLocal.getUTCDate()).padStart(2, '0');
  const month = months[dateLocal.getUTCMonth()];
  const year = dateLocal.getUTCFullYear();

  return `${hours}:${minutes} - ${day} ${month} ${year}`;
};

export function getCurrentMonth() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonth = months[currentMonthIndex];
  const currentYear = currentDate.getFullYear();

  return `${currentMonth} ${currentYear}`;
}
export async function getTotalExpenseForCurrentMonth() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1

    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0),
    ); // Set to the first day of the current month
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999),
    ); // Set to the last day of the current month

    const {data, error} = await supabase
      .from('items')
      .select(`price`)
      .filter('createdAt', 'gte', startOfMonth.toISOString())
      .filter('createdAt', 'lte', endOfMonth.toISOString());

    if (error) {
      throw new Error(error.message);
    }
    const totalExpense = data.reduce((acc, item) => {
      return (acc += item.price);
    }, 0);

    return totalExpense;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTotalExpense(): Promise<Map<number, number>> {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Get zero-padded month (01 to 12)
    const {data: userIds} = await supabase.from('users').select('id');
    const {data, error} = await supabase
      .from('total_expense_monthly')
      .select('*')
      .match({
        month: `${currentYear}-${currentMonth}-01 00:00:00`, // Current month in YYYY-MM-DD format
      });
    if (error) throw new Error(error.message);
    const modifiedResult = userIds?.reduce((acc, item1) => {
      if (!acc.has(item1.id)) {
        acc.set(
          item1.id,
          data.find(item => item.user_id === item1.id)?.total ?? 0,
        );
      }
      return acc;
    }, new Map<number, number>());

    return modifiedResult as Map<number, number>;
  } catch (err) {
    console.log(err);
    return new Map<number, number>();
  }
}

export async function getTotalExpensesOfEachUser() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1
    const {data: userIds} = await supabase.from('users').select('id');
    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0),
    ); // Set to the first day of the current month
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999),
    ); // Set to the last day of the current month

    let query = supabase
      .from('items')
      .select(`price,userId`)
      .filter('createdAt', 'gte', startOfMonth.toISOString())
      .filter('createdAt', 'lte', endOfMonth.toISOString());

    const {data, error} = await query;
    if (error) throw new Error(error.message);

    const result: Map<number, number> = data.reduce((acc, item) => {
      if (acc.has(item.userId)) {
        acc.set(item.userId, acc.get(item.userId) + item.price);
      } else {
        acc.set(item.userId, item.price);
      }
      return acc;
    }, new Map<number, number>());

    userIds?.forEach(item => {
      if (!result.has(item.id)) {
        result.set(item.id, 0);
      }
    });
    return result;
  } catch (err) {
    console.log(err);
    return new Map<number, number>();
  }
}

export async function getTotalSpend(id: number): Promise<number | undefined> {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1

    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0),
    ); // Set to the first day of the current month
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999),
    ); // Set to the last day of the current month

    const {data, error} = await supabase
      .from('items')
      .select('price')
      .eq('userId', id)
      .filter('createdAt', 'gte', startOfMonth.toISOString())
      .filter('createdAt', 'lte', endOfMonth.toISOString());
    if (error) throw new Error(error.message);
    let totalSpend: number | undefined;
    totalSpend = data?.reduce((acc, item) => (acc += item.price), 0);
    return totalSpend;
  } catch (err) {
    console.log(err);
    return 0;
  }
}
