import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TypeProduct, products } from '../product-data';
import { useDispatch } from 'react-redux';
import { addInvoice } from '../actions/invoiceActions';
import { useToast } from '@/components/ui/use-toast';

export function ModalAddInvoice() {
  const dispatch = useDispatch();
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<TypeProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<TypeProduct[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    salespersonName: '',
    paymentType: '',
    notes: '',
    products: []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!date) newErrors.date = 'Date is required';
    if (!formData.customerName)
      newErrors.customerName = 'Customer name is required';
    if (!formData.salespersonName)
      newErrors.salespersonName = 'Salesperson name is required';
    if (!formData.paymentType)
      newErrors.paymentType = 'Payment type is required';
    if (selectedProducts.length === 0)
      newErrors.products = 'At least one product is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle product search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredProducts(
      products
        .filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
        .filter(
          (product) =>
            !selectedProducts.some((selected) => selected.name === product.name)
        )
    );
  };

  // Handle product selection
  const handleProductClick = (product: TypeProduct) => {
    setSelectedProducts((prevSelected) => [...prevSelected, product]);
    setFilteredProducts((prevFiltered) =>
      prevFiltered.filter((p) => p.name !== product.name)
    );
  };

  // Handle product removal
  const handleRemoveProduct = (product: TypeProduct) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((p) => p.name !== product.name)
    );
    setFilteredProducts((prevFiltered) =>
      [...prevFiltered, product].filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const invoiceData = {
      date,
      customerName: formData.customerName,
      salespersonName: formData.salespersonName,
      paymentType: formData.paymentType,
      notes: formData.notes,
      products: selectedProducts
    };

    dispatch(addInvoice(invoiceData) as any);

    // Reset form and state after successful submission
    setDate(undefined);
    setSearchTerm('');
    setFilteredProducts(products);
    setSelectedProducts([]);
    setFormData({
      customerName: '',
      salespersonName: '',
      paymentType: '',
      notes: '',
      products: []
    });
    setErrors({});
    // Optionally close the dialog if needed
    toast({
      title: 'Invoice added',
      description: 'The invoice has been added successfully'
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className='w-5 h-5' />
            Add new
            <span className='sr-only'>Add new</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Invoice</DialogTitle>
              <DialogDescription>
                Fill in the form below to add a new invoice
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid items-center grid-cols-4 gap-4'>
                {/* Date */}
                <Label htmlFor='date' className='text-right'>
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}>
                      <CalendarIcon className='w-4 h-4 mr-2' />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {errors.date && (
                <p className='w-full text-red-500 text-end'>{errors.date}</p>
              )}
              <div className='grid items-center grid-cols-4 gap-4'>
                {/* Customer Name */}
                <Label htmlFor='customerName' className='text-right'>
                  Customer Name
                </Label>
                <Input
                  id='customerName'
                  name='customerName'
                  type='text'
                  placeholder='John Doe'
                  className='col-span-3'
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>
              {errors.customerName && (
                <p className='w-full text-red-500 text-end'>
                  {errors.customerName}
                </p>
              )}
              <div className='grid items-center grid-cols-4 gap-4'>
                {/* Salesperson Name */}
                <Label htmlFor='salespersonName' className='text-right'>
                  Salesperson Name
                </Label>
                <Input
                  id='salespersonName'
                  name='salespersonName'
                  type='text'
                  placeholder='Jane Doe'
                  className='col-span-3'
                  value={formData.salespersonName}
                  onChange={handleInputChange}
                />
              </div>
              {errors.salespersonName && (
                <p className='w-full text-red-500 text-end'>
                  {errors.salespersonName}
                </p>
              )}
              <div className='grid items-center grid-cols-4 gap-4'>
                {/* Payment Type */}
                <Label htmlFor='paymentType' className='text-right'>
                  Payment Type
                </Label>
                <Input
                  id='paymentType'
                  name='paymentType'
                  type='text'
                  placeholder='Credit Card'
                  className='col-span-3'
                  value={formData.paymentType}
                  onChange={handleInputChange}
                />
              </div>
              {errors.paymentType && (
                <p className='w-full text-red-500 text-end'>
                  {errors.paymentType}
                </p>
              )}
              <div className='grid items-center grid-cols-4 gap-4'>
                {/* Notes */}
                <Label htmlFor='notes' className='text-right'>
                  Notes
                </Label>
                <Input
                  id='notes'
                  name='notes'
                  type='text'
                  placeholder='Add notes here'
                  className='col-span-3'
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {selectedProducts.map((product) => (
              <Card
                key={product.name}
                className='relative transition-all cursor-pointer hover:filter hover:brightness-90 hover:shadow-lg'>
                <CardHeader className='flex flex-row items-center justify-between pb-0 '>
                  <Button
                    className='absolute top-0 right-0'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveProduct(product)}>
                    <X className='w-5 h-5' />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className='flex'>
                    <img
                      src={product.picture}
                      alt={product.name}
                      className='object-cover w-16 h-16 mr-4 rounded-lg'
                    />
                    <div className='flex justify-between w-full'>
                      <div className='text-lg font-semibold'>
                        {product.name}
                        <div
                          className='text-xs text-muted-foreground'
                          style={{ marginTop: '0.25rem' }}>
                          {product.stock} Left
                        </div>
                      </div>
                      <div className='flex flex-col items-end justify-end h-full'>
                        <div className='text-lg font-semibold text-right'>
                          $ {product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className='my-4'>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Search for a product to add to the invoice
              </DialogDescription>
              {errors.products && (
                <p className='w-full text-red-500 text-end'>
                  {errors.products}
                </p>
              )}
              <div className='relative mt-4 mb-2'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder='Search products...'
                  className='w-full pl-8'
                />
              </div>
              <div className='flex flex-col gap-4'>
                {filteredProducts.map((product) => (
                  <Card
                    key={product.name}
                    className='transition-all cursor-pointer hover:filter hover:brightness-90 hover:shadow-lg'
                    onClick={() => handleProductClick(product)}>
                    <CardHeader className='flex flex-row items-center justify-between pb-0 '></CardHeader>
                    <CardContent>
                      <div className='flex'>
                        <img
                          src={product.picture}
                          alt={product.name}
                          className='object-cover w-16 h-16 mr-4 rounded-lg'
                        />
                        <div className='flex justify-between w-full'>
                          <div className='text-lg font-semibold'>
                            {product.name}
                            <div
                              className='text-xs text-muted-foreground'
                              style={{ marginTop: '0.25rem' }}>
                              {product.stock} Left
                            </div>
                          </div>
                          <div className='flex flex-col items-end justify-end h-full'>
                            <div className='text-lg font-semibold text-right'>
                              $ {product.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Add Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
