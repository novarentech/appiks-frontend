interface StatsProps {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

const Stats = ({
  heading = "Dampak Positif",
  description = "Bersama appiks.id, mari ciptakan lingkungan yang lebih sehat untuk semua siswa",
  stats = [
    {
      id: "stat-1",
      value: "95%",
      label: "Siswa merasa lebih baik",
    },
    {
      id: "stat-2",
      value: "92%",
      label: "Berkurangnya kasus bullying",
    },
    {
      id: "stat-3",
      value: "89%",
      label: "Peningkatan awareness",
    },
    {
      id: "stat-4",
      value: "1000+",
      label: "Siswa terdaftar",
    },
  ],
}: StatsProps) => {
  return (
    <section className="w-full py-32 sm:py-40 lg:py-52">
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl">
            {description}
          </p>
        </div>
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col gap-3 justify-center items-center py-8 px-4"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-base sm:text-lg text-muted-foreground text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stats };
