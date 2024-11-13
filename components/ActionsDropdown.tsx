'use client'
import React, { useState } from 'react'
import {
    Dialog,
  } from "@/components/ui/dialog"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constants'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
  
  

const ActionsDropdown = ({file} : {file : Models.Document}) => {
    const [isModalOpen,setIsModelOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModelOpen}>
 <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
  <DropdownMenuTrigger className='shad-no-focus'>
    <Image
    src='/assets/icons/dots.svg'
    alt='dots'
    width={34}
    height={34}
    />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
  <DropdownMenuLabel className="max-w-[200px] truncate">
            {file?.name}
          </DropdownMenuLabel>
    <DropdownMenuSeparator />
    {actionsDropdownItems.map((actionItem) => (
        <DropdownMenuItem 
        key={actionItem.value}
        className='shad-dropdown-item'
        onClick={() => {
            setAction(actionItem);

            if(
                [
                    'rename',
                    'share',
                    'delete',
                    'details'
                ].includes(actionItem.value)
            ){
                setIsModelOpen(true);
            }
        }}
        >
            <Link
            href={constructDownloadUrl(file.bucketFileId)}
            download={file.name}
            className='flex items-center gap-2'
            >
                <Image
                src={actionItem.icon}
                alt={actionItem.label}
                width={30}
                height={30}
                />
            </Link>
        </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

</Dialog>

  )
}

export default ActionsDropdown