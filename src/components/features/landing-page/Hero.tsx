import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="w-full bg-muted min-h-screen flex items-center pt-20 pb-10">
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2 min-h-[60vh] lg:min-h-[70vh]">
          <div className="flex flex-col items-center py-10 text-center lg:items-start lg:text-left lg:py-20">
            <h1 className="my-6 text-pretty text-3xl font-bold sm:text-4xl lg:text-6xl">
              Platform Kesehatan Mental untuk Siswa
            </h1>
            <p className="text-muted-foreground mt-4 mb-12 max-w-xl text-base sm:text-lg lg:text-xl">
              Pantau mood harianmu, dapatkan dukungan, dan jaga kesehatan
              mentalmu bersama appiks.id
            </p>
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button className="rounded-full w-full sm:w-auto" size="lg">
                Mulai Sekarang
              </Button>
              <Button
                variant="outline"
                className="rounded-full w-full sm:w-auto"
                size="lg"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-full">
            <Image
              width={500}
              height={500}
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
              alt="placeholder hero"
              className="h-auto w-full max-w-[400px] sm:max-w-[500px] object-cover "
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
