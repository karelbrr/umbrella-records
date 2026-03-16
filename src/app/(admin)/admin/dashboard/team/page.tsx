import { TeamList } from "@/components/team/team-list";

export const metadata = {
  title: "Team | Umbrella Records Admin",
  description: "Team admin page",
};


export default function Page() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div>
        <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
          Team Dashboard
        </h1>
        <p className="mt-1  lg:text-left text-center text-muted-foreground">
          Your team members
        </p>
      </div>

      <TeamList />
    </div>
  );
}
