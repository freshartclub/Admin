import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetDisciplineMutation } from '../DisciplineListCategory/http/useGetDisciplineMutation';
import addTechnicMutation from './http/addTechnicMutation';
import { useGetTechnicById } from './http/useGetTechnicById';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
    name: zod.string().min(1, { message: 'Title is required!' }),
    spanishName: zod.string().min(1, { message: 'Spanish Title is required!' }),
    discipline: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
    isDeleted: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddtechnicCategory() {
    const id = useSearchParams().get('id');
    const { data } = useGetDisciplineMutation();
    const navigate = useNavigate();

    const { data: styleData, isLoading } = useGetTechnicById(id);

    const defaultValues = useMemo(
        () => ({
            name: styleData?.technicName || '',
            spanishName: styleData?.spanishTechnicName || '',
            isDeleted: styleData?.isDeleted || false,
            discipline: (styleData?.discipline && styleData?.discipline.map((item) => item._id)) || [],
        }),
        [styleData]
    );

    const methods = useForm<NewProductSchemaType>({
        resolver: zodResolver(NewProductSchema),
        defaultValues,
    });

    const { reset, watch, setValue, handleSubmit } = methods;

    useEffect(() => {
        if (id && styleData) {
            reset({
                name: styleData?.technicName || '',
                spanishName: styleData?.spanishTechnicName || '',
                isDeleted: styleData?.isDeleted || false,
                discipline: styleData?.discipline.map((item) => item._id) || [],
            });
        }
    }, [styleData, reset]);

    const { mutate, isPending } = addTechnicMutation(id);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await mutate(data);
        } catch (error) {
            console.error(error);
        }
    });

    const optionsIn = [
        {
            label: 'Active',
            value: false,
        },
        {
            label: 'Inactive',
            value: true,
        },
    ];

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            <CustomBreadcrumbs
                heading={id ? 'Edit Technic' : 'Add Technic'}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: id ? 'Edit Technic' : 'Add Technic' },
                ]}
                sx={{ mb: { xs: 3, md: 3 } }}
            />
            <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={{ xs: 3, md: 5 }}>
                    {renderDetails}

                    <div className="flex justify-end gap-2">
                        <span
                            onClick={() => navigate(paths.dashboard.category.technic.list)}
                            className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
                        >
                            Cancel
                        </span>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="px-3 py-2 text-white bg-black rounded-md"
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </Stack>
            </Form>
        </>
    );
}