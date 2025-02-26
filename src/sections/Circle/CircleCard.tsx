import { Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { fDateTime } from 'src/utils/format-time';
import useDeleteCircle from './http/useDeleteCircle';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { Button } from '@mui/material';

export function CircleCard({ url, data }) {
  const navigate = useNavigate();
  const confirm = useBoolean();
  const { mutate, isPending } = useDeleteCircle(data?._id);

  const deleteCircle = () => {
    mutate();
    confirm.onFalse();
  };

  return (
    <>
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
          <div className="flex text-[13px] justify-between items-center">
            <div className="flex items-center">
              <Typography
                variant="body2"
                className="rounded-full px-2"
                sx={{
                  backgroundColor: (theme) =>
                    data?.status === 'Published'
                      ? theme.palette.info.lighter
                      : theme.palette.warning.lighter,
                  color: (theme) =>
                    data?.status === 'Published'
                      ? theme.palette.info.dark
                      : theme.palette.warning.dark,
                  fontSize: '12px',
                }}
              >
                {data?.status}
              </Typography>

              {data?.isDeleted == true ? (
                <span className="w-fit h-fit bg-[#FEEDEC] text-[#f05438] rounded-2xl text-[12px] px-2">
                  InActive
                </span>
              ) : (
                <span className="w-fit h-fit bg-[#f2feec] text-[#0D894F] rounded-2xl text-[12px] px-2">
                  Active
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <span
                onClick={() => navigate(`${paths.dashboard.circle.add}?id=${data?._id}`)}
                className="bg-black cursor-pointer justify-center text-[15px] text-white rounded-md flex items-center p-2"
              >
                Edit
              </span>
              <span
                onClick={() => confirm.onTrue()}
                className={`bg-white cursor-pointer border ${data?.isDeleted == true ? 'border-green-800 text-green-800' : 'border-red-500 text-red-500'} justify-center text-[15px] rounded-md flex items-center p-2`}
              >
                {data?.isDeleted ? 'Restore' : 'Delete'}
              </span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-[#a7a7a7] text-[14px]">{fDateTime(data?.createdAt)}</span>
            <Typography variant="h6">{data?.title}</Typography>
            <Typography variant="body2">
              {data?.description?.length < 140
                ? data?.description.slice(0, 140)
                : data?.description.slice(0, 140).concat('...')}
            </Typography>
          </div>
          <div className="flex gap-3 items-center mt-2 flex-wrap overflow-x-auto">
            <p className="flex items-center">
              <Iconify icon="material-symbols:category-outline-rounded" className="mr-1 !w-4" />
              <span className="text-[#a7a7a7] text-[13px]">
                {data?.categories?.map((category: any) => category).join(', ')}
              </span>
            </p>
            <p className="flex items-center">
              <Iconify icon="lets-icons:view-fill" className="mr-1 !w-4" />
              <span className="text-[#a7a7a7] text-[13px]">Views</span>
              <span className="text-[#a7a7a7] text-[13px] ml-1">({data?.viewCount})</span>
            </p>
            <p className="flex items-center">
              <Iconify icon="tdesign:member-filled" fontSize={10} className="mr-1 !w-4" />
              <span className="text-[#a7a7a7] text-[13px]">Members</span>
              <span className="text-[#a7a7a7] text-[13px] ml-1">({data?.followerCount})</span>
            </p>
            <p className="flex items-center">
              <Iconify icon="iconoir:post" className="mr-1 !w-4" />
              <span className="text-[#a7a7a7] text-[13px]">Posts</span>
              <span className="text-[#a7a7a7] text-[13px] ml-1">({data?.postCount})</span>
            </p>
            <p className="flex items-center">
              <Iconify icon="mdi:recent" className="mr-1 !w-4" />
              <span className="text-[#a7a7a7] text-[13px]">Latest Post</span>
              <span className="text-[#a7a7a7] text-[13px] ml-1">
                ({data?.latestPost ? fDateTime(data?.latestPost?.createdAt) : 'N/A'})
              </span>
            </p>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={data?.isDeleted == true ? 'Restore' : 'Delete'}
        content={
          data?.isDeleted == true
            ? 'Are you sure want to restore this circle?'
            : 'Are you sure want to delete this circle?'
        }
        action={
          data?.isDeleted == true ? (
            <Button variant="contained" color="success" onClick={deleteCircle}>
              {isPending ? 'Restoring...' : 'Restore'}
            </Button>
          ) : (
            <Button variant="contained" color="error" onClick={deleteCircle}>
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          )
        }
      />
    </>
  );
}
