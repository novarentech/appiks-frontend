import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const cardItems = [
  {
    name: "Doni Wicaksana",
    role: "Siswa",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    testimonial:
      "Awalnya aku jarang memperhatikan mood sendiri, tapi sejak pakai Appiks, aku jadi lebih peka sama perasaanku. Fitur catat mood hariannya gampang banget dipakai, dan tips self-help-nya bener-bener membantu pas lagi down.",
  },
  {
    name: "Adi Wirawan",
    role: "Guru BK",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    testimonial:
      "Dengan Appiks, saya mendapat data yang jelas dan real-time tentang kondisi emosional siswa. Ini sangat membantu dalam menentukan prioritas tindak lanjut dan memberikan bimbingan yang tepat.",
  },
  {
    name: "Grace Wijaya",
    role: "Wali Kelas",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    testimonial:
      "Appiks memudahkan saya memantau kondisi siswa tanpa harus menunggu sampai ada masalah besar. Saya bisa tahu siapa yang sedang butuh perhatian lebih dan menghubungi mereka lebih cepat.",
  },
];

const Testimonial = () => {
  return (
    <section className="w-full py-24 sm:py-36 lg:py-48">
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl">
            Bagaimana Appiks Membantu Mereka?
          </h2>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl">
            Ribuan Pengguna Telah Memulai Perjalanan Self-Awareness Bersama Kami
          </p>
        </div>
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 xl:grid-cols-3">
          {cardItems.map((item) => (
            <Card
              key={item.name}
              className="h-full flex flex-col bg-muted"
            >
              <CardFooter>
                <div className="flex gap-4 items-center">
                  <Avatar className="size-10 rounded-full ring-1 ring-input">
                    <AvatarImage src={item.avatar} alt={item.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium text-base sm:text-lg">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
              </CardFooter>
              <CardContent className="px-6 leading-7 text-foreground/70">
                <blockquote className="italic text-sm sm:text-base mt-2">
                  &ldquo;{item.testimonial}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonial };
