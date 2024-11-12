import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from '@/components/Search'
import FileUploader from '@/components/FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

const Header = () => {
  return (
    <header className='header'>
      <Search/> 
      <div className='header-wrapper'>
        <FileUploader/> 
        <form action={async () => {
          'use server';

          await signOutUser();
        }}>
          <Button className='sign-out-button' type='submit'>
            <Image
            src='/assets/icons/logout.svg'
            alt='logout'
            width={24}
            height={24}
            className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header