import { Link } from 'react-router-dom';
import { Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '../mode-toggle';
import { ThemeProvider } from '../theme-provider';

export default function navigation() {
  return (
    <header className='sticky top-0 flex items-center h-16 gap-4 px-4 border-b bg-background md:px-6'>
      <nav className='flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          to='/'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'>
          <Package2 className='w-6 h-6' />
          <span className='sr-only'>Test Case</span>
        </Link>
        <Link
          to='/'
          className='transition-colors text-foreground hover:text-foreground'>
          Dashboard
        </Link>
        <Link
          to='/revenue'
          className='transition-colors text-muted-foreground hover:text-foreground'>
          Analytics
        </Link>
        <ThemeProvider>
          <ModeToggle />
        </ThemeProvider>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='w-5 h-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              to='/'
              className='flex items-center gap-2 text-lg font-semibold'>
              <Package2 className='w-6 h-6' />
              <span className='sr-only'>Acme Inc</span>
            </Link>
            <Link to='/' className='hover:text-foreground'>
              Dashboard
            </Link>
            <Link
              to='/revenue'
              className='text-muted-foreground hover:text-foreground'>
              Analytics
            </Link>
            <ThemeProvider>
              <ModeToggle />
            </ThemeProvider>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
