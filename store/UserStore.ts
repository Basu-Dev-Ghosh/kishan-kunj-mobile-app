import {create} from 'zustand';
import {updatePresentToDB, updateUserImageToDB} from '../utils/user.util';
import {queryClient} from '../App';
interface currentUserState {
  currentUser: User | null;
  setCurrentUser(user: User): void;
  changePresent(value: boolean): void;
  changePhoto(value: string): void;
}
export const useCurrentUser = create<currentUserState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user: User) => set({currentUser: user}),
  changePresent: async (value: boolean) => {
    const {currentUser} = get();
    if (!currentUser) return;
    const newCurrentUser = {...currentUser, ispresent: value};
    set({currentUser: newCurrentUser});
    await updatePresentToDB(value, currentUser.email);
    queryClient.invalidateQueries({queryKey: ['users']});
  },
  changePhoto: async (value: string) => {
    const {currentUser} = get();
    if (!currentUser) return;
    const newCurrentUser = {...currentUser, image: value};
    set({currentUser: newCurrentUser});
    await updateUserImageToDB(value, currentUser.email);
    queryClient.invalidateQueries({queryKey: ['users']});
  },
}));
