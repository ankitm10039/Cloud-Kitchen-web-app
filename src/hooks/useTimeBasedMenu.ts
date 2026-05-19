import { useAppSelector } from '../store';

export const useTimeBasedMenu = () => {
  const selectedTiming = useAppSelector((state) => state.menu.selectedTiming);

  const getTimingGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return {
        greeting: "Good Morning",
        currentSlot: "Breakfast",
        subtitle: "Start your day with our freshly prepared gourmet breakfast slots."
      };
    } else if (hours >= 12 && hours < 17) {
      return {
        greeting: "Good Afternoon",
        currentSlot: "Lunch",
        subtitle: "Fuel your midday hustle with our wholesome lunch thalis and bowls."
      };
    } else {
      return {
        greeting: "Good Evening",
        currentSlot: "Dinner",
        subtitle: "Unwind tonight with chef-curated premium dinners and specialties."
      };
    }
  };

  const timingInfo = getTimingGreeting();

  const isMatchingSystemTime = selectedTiming === timingInfo.currentSlot;

  return {
    selectedTiming,
    ...timingInfo,
    isMatchingSystemTime,
  };
};
