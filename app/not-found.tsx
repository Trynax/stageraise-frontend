import Link from 'next/link'
import { Header } from '@/components/ui/header' 
import { Footer } from '@/components/sections/footer' 
import Image from 'next/image'

export default function NotFound() {
  return (
    <>
      <Header />
      
      <section className='min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-20'>
        <div className='text-center mb-8'>
          <Image 
            src="/images/404.svg" 
            alt="404 Page not found" 
            width={600} 
            height={400}
            className='mx-auto w-full max-w-md md:max-w-lg'
          />
        </div>
        
        <p className='text-xl md:text-2xl  text-dark mb-8'>
          Oops! This page could not be found.
        </p>
        
        <Link 
          href="/"
          className='px-8 py-3 bg-secondary text-dark rounded-xl font-semibold text-base md:text-lg hover:scale-105 transition-transform duration-300 shadow-lg inline-block'
        >
          Go back to homepage
        </Link>
      </section>
      
      <Footer />
    </>
  )
}