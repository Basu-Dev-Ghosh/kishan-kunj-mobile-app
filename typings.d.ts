type User = {
  id: number;
  fullName: string;
  displayName: string;
  department: string;
  image: string;
  email: string;
  ispresent: boolean;
};

type Category = {
  id: number;
  name: string;
  iconName: string;
  description: string;
};

type Item = {
  createdAt?: string;
  id?: number;
  price: number;
  categoryId: number;
  description: string;
  userId?: number;
  users?: {
    id: number;
    fullName: string;
    image: string;
  };
};

type FilterOption = {
  title?: string;
  value?: number;
};
type FilterType = {
  title: string;
  options: FilterOption[] | undefined;
  value?: number;
  setValue?: (value: number) => void;
};

type PaidRequest = {
  id: number;
  createdAt: string;
  screenshot: string;
  from_fullname: string;
  from: number;
  items: {
    description: string;
    price: number;
    id: number;
  };
  users: {
    image: string;
  };
};

type Notification = {
  id: number;
  createdAt: string;
  status: string;
  users: {
    fullName: string;
    image: string;
  };
  items: {
    description: string;
    price: number;
  };
};
