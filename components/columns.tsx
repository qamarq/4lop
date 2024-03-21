/* eslint-disable @next/next/no-img-element */
import { Checkbox } from './ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from './ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formattedPrice } from '@/lib/utils';

export const columns: ColumnDef<CartProducts>[] = [
    {
        id: 'zaznacz',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'zdjęcie',
        header: 'Zdjęcie',
        cell: ({ row }) => {
            const icon = row.original.data.iconImage
            return (
                <div className="capitalize w-[70px] h-[70px] rounded-md bg-[#eee] flex items-center justify-center">
                    <img className='w-[80%] max-h-[80%] mix-blend-multiply' src={icon} alt="" />
                </div>
            )
        },
    },
    {
        accessorKey: 'nazwa',
        header: 'Nazwa',
        cell: ({ row }) => {
            const name = row.original.data.name
            const desc = row.original.data.shortDescription
            return (
                <div className="capitalize">
                    <h1 className='font-bold text-[1.7rem]'>{name}</h1>
                    <h2 className='truncate max-w-[300px] font-semibold'><span className='text-gray-500 font-medium'>Opis: </span>{desc}</h2>
                    {row.original.data.variant && (
                        <h2 className='truncate max-w-[300px] font-semibold'><span className='text-gray-500 font-medium'>Wersja: </span>{row.original.data.variant}</h2>
                    )}
                    <h2 className='truncate max-w-[300px] font-semibold normal-case'><span className='text-gray-500 font-medium'>Cena/szt.: </span>{formattedPrice(row.original.data.price)}</h2>
                </div>
            )
        },
    },
    {
        accessorKey: 'ilość',
        header: "Ilość",
        cell: ({ row }) => {
            const quantity = row.original.quantity
            return (
                <div className="lowercase">{quantity === -1 ? 0 : quantity} szt.</div>
            )
        },
    },
    {
        accessorKey: 'cena',
        header: ({ column }) => {
            return (
                <div className='flex items-center justify-end'>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }>
                        Cena
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const price = row.original.worth.gross.formatted

            return <div className="text-right font-medium">{price}</div>;
        },
    },
    // {
    //     id: 'actions',
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const name = row.original.data.name;
    //         const link = `/sklep/produkt/${prepareLink(row.original.data.link)}`
    //         // const { updateDialogUpdateOpened } = useCart()

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Więcej</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     {/* <DropdownMenuLabel>Akcje</DropdownMenuLabel> */}
    //                     <DropdownMenuItem
    //                         onClick={() =>
    //                             navigator.clipboard.writeText(name)
    //                         }>
    //                             {/* <CopyIcon className="mr-2 h-4 w-4" /> */}
    //                             <span>Skopiuj nazwę</span>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem onClick={() => 
    //                         window.location.href = link
    //                     }>
    //                         {/* <EyeIcon className="mr-2 h-4 w-4" /> */}
    //                         <span>Zobacz produkt</span>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         {/* <TrashIcon className="mr-2 h-4 w-4" /> */}
    //                         <span>Zmień ilość</span>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         {/* <TrashIcon className="mr-2 h-4 w-4" /> */}
    //                         <span>Usuń</span>
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
