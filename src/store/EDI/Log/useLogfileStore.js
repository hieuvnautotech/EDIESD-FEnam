import { create } from 'zustand';

const useLogfileStore = create((set, get) => ({
  record: {
    LogMessage: '',
    LogType: 'SUCCESS',
    ItemCode: '',
    LogTime: '',
    NumberOfMeasurements: '',
  },
  dispatchSetRecord: (item) => {
    set({ record: item });
  },

  recordArr: [],
  dispatchSetRecordArr: (data, mode) => {
    const records = get().recordArr;

    switch (mode) {
      case 'ADD':
        set({ recordArr: [...data, ...records] });
        break;

      default:
        set({ recordArr: [...data] });
        break;
    }
  },
}));

export default useLogfileStore;
