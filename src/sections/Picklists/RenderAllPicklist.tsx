import { useEffect, useState } from 'react';
import { useGetPicklistMutation } from './http/useGetPicklistMutation';

export const RenderAllPicklist = (field: string) => {
  const [picklst, setPicklist] = useState([]);
  const { data } = useGetPicklistMutation();

  useEffect(() => {
    const list =
      data && data.length > 0 ? data.filter((item: any) => item?.picklistName === field) : [];

    if (list?.length > 0 && list[0]?.picklist?.length > 0) {
      setPicklist(
        list[0]?.picklist.map((item: any) => ({
          label: item.name,
          value: item.name,
        }))
      );
    }
  }, [data]);

  return picklst;
};
