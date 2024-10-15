import type { IPostItem } from 'src/types/blog';
import { Box, Card, CardHeader, Stack } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useEffect, useMemo } from 'react';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { TICKET_TYPE_OPTIONS,TICKET_STATUS_OPTIONS } from 'src/_mock';


export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
    email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email residentialAddress!' }),
     ticketType: zod.string().min(1, { message: 'Type is required!' }),
     status: zod.string().min(1, { message: 'Status is required!' }),
     tickedIssue: zod.string()

//   images: schemaHelper.file({ message: { required_error: 'Images is required!' } }),
//   tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  
});

type Props = {
    currentPost?: IPostItem;
  };
export function TicketDetailView({ticket, currentPost }: Props) {
    const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
        email: currentPost?.email || '',
        ticketType: currentPost?.ticketType || '',
        status:currentPost?.status || '',
        tickedIssue:currentPost?.tickedIssue || '',
    //   images: currentPost?.images || [],
    //   tags: currentPost?.tags || [],
      
    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      toast.success(currentPost ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
    const datailForm = (
       <div>
        <CardHeader title='Reply To Ticket'/>
       <Stack spacing={3} sx={{ p: 3 }}>
       <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
        <Field.Text name="email" label="Customer Email" />

        <Field.SingelSelect 
         checkbox
         name="ticketType"
         label="Ticket Type"
         options={TICKET_TYPE_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="status"
         label="Status"
         options={TICKET_STATUS_OPTIONS}
        />
        </Box>
         <Field.Text name='tickedIssue' label='Type Ticket issue' multiline rows={4}/>
       </Stack>
       </div>
        
    )
    return(
        <>
        <CustomBreadcrumbs
          heading="Teckets"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tecket List', href: paths.dashboard.tickets.allList },
            {name:'Ticket'}
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card className="p-5">
            <div>
            <div className="flex justify-between gap-4 pb-5">
          <div className="flex gap-4">
          <div className={`w-[1.5rem] h-[1.5rem] rounded-full ${ticket.Status === "Created" ? "bg-[#F8A534]" : ticket.Status === "Dispatched" ? "bg-[#3B8AFF]": ticket.Status === "Technical Finish" ? "bg-[#8E33FF]" : ticket.Status === "In progress" ? "bg-[#FFAB00]": "bg-[#54C104]" }`}></div>
          <h2 className="text-[16px] text-black font-bold">Ticket #{ticket.TicketNumber}</h2>
          </div>
          <div>
          <p className="text-[#84818A] text-[14px] font-semibold">Posted at {ticket.Time}</p>
          </div>
       </div>
       <h2 className="text-black text-[16px] font-bold">How to deposit money to my portal?</h2>
       <p className="text-[#84818A] text-[14px] font-semibold pt-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit sint, alias facilis culpa porro, possimus minus cumque ullam rerum quo recusandae pariatur velit modi dicta accusantium iste labore amet hic! <br/>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium asperiores perferendis sunt architecto aperiam. A, hic omnis nulla ea dignissimos quos odit voluptates aliquid nisi adipisci maxime dolor doloremque accusantium!
       </p>
            </div>

            <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={5}> 
            {datailForm}
            <div className='flex flex-row justify-end gap-3'>
           <button type='submit' className='bg-black text-white py-2 px-3 rounded-md'>Submit Reply</button>
            </div>
            </Stack>
            </Form>
        </Card>
        </>
    )
}