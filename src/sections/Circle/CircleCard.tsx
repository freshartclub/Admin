import { Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Image } from 'src/components/image';
import { paths } from 'src/routes/paths';
import { fDateTime } from 'src/utils/format-time';

export function CircleCard({ url, data }) {
  const navigate = useNavigate();

  return (
    <div className="p-2 pb-2 border gap-3 w-full flex rounded-md mb-4">
      <div className="relative">
        <img
          src={`${url}/users/${data?.mainImage}`}
          width={'200px'}
          className="max-h-[130px] h-full rounded object-cover"
        />
        <Avatar
          sx={{ border: '2px solid white', position: 'absolute', top: '10px', right: '10px' }}
          alt="Cover"
          src={`${url}/users/${data?.coverImage}`}
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-between items-center">
          <Typography
            variant="body2"
            sx={{
              backgroundColor: (theme) =>
                data?.status === 'Published'
                  ? theme.palette.info.lighter
                  : theme.palette.warning.lighter,
              color: (theme) =>
                data?.status === 'Published' ? theme.palette.info.dark : theme.palette.warning.dark,
              fontWeight: 'bold',
              padding: '0.25rem 0.5rem',
              borderRadius: '5px',
            }}
          >
            {data?.status}
          </Typography>
          <div className="flex gap-2">
            <span
              onClick={() => navigate(`${paths.dashboard.circle.add}?id=${data?._id}`)}
              className="bg-black cursor-pointer justify-center text-[15px] text-white rounded-md flex items-center p-2"
            >
              Assign Manager
            </span>
            <span className="bg-white cursor-pointer border justify-center text-[15px] text-black rounded-md flex items-center p-2">
              Invite Manager
            </span>
          </div>
        </div>
        <div>
          <span className="text-[#a7a7a7] text-[14px]">{fDateTime(data?.createdAt)}</span>
          <Typography variant="h6">{data?.title}</Typography>
          <Typography variant="body2">
            {data?.description?.length < 140
              ? data?.description.slice(0, 140)
              : data?.description.slice(0, 140).concat('...')}
          </Typography>
        </div>
      </div>
    </div>
  );
}
