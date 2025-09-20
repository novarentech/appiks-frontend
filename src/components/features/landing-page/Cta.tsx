import { Button } from "@/components/ui/button";
import Image from "next/image";

const Cta = () => {
  return (
    <section className="w-full bg-muted py-24 sm:py-36 lg:py-48">
      <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex justify-center items-center w-full h-full">
            <Image
              width={500}
              height={500}
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
              alt="placeholder hero"
              className="h-auto w-full max-w-[400px] sm:max-w-[500px] object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center py-10 text-center md:items-start md:text-left md:py-20">
            <h1 className="mt-6 mb-8 text-pretty text-3xl sm:text-4xl lg:text-6xl">
              Siap Memulai Perjalanan Kesehatan Mentalmu?
            </h1>
            <p className="text-muted-foreground mb-10 max-w-xl text-base sm:text-lg lg:text-xl">
              Kenali mood-mu, ceritakan jika ada yang mengganggu, dan temukan
              dukungan yang kamu butuhkan di sini.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row md:justify-start">
              <Button className="rounded-full w-full sm:w-auto" size="lg">
                Mulai Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta };
