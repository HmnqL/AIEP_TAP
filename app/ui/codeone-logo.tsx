import Image from 'next/image';

export default function CodeOneLogo() {
  return (
    <div
      className="flex flex-row items-center  leading-none"
    >
      <Image
          src="/Codeone.png"
          width={500}
          height={500}
          className='h-16 w-16 rounded-full'
          alt='CodeOne Simplyfied Logo'
      />
    </div>
  );
}