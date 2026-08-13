/** A little calendar leaf: coloured header band, big day number, sat on the
 *  page with a shadow. Marks where each day starts. */
export function DayTile({
  weekday,
  day,
  size = "md",
}: {
  weekday: string;
  day: number;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? 48 : 68;
  const band = size === "sm" ? 15 : 21;

  return (
    <div
      aria-hidden
      className="shrink-0 overflow-hidden rounded-[22%] bg-surface shadow-md"
      style={{ width: px, height: px }}
    >
      <div
        className="grid place-items-center text-white"
        style={{
          height: band,
          background: "linear-gradient(160deg, #2a6ba8 0%, #17416b 100%)",
          boxShadow: "inset 0 -1px 2px rgb(0 0 0 / 0.22)",
          fontSize: size === "sm" ? 9 : 11.5,
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        {weekday}
      </div>
      <div
        className="tnum grid place-items-center font-medium"
        style={{
          height: px - band,
          fontSize: size === "sm" ? 20 : 28,
          letterSpacing: "-0.02em",
        }}
      >
        {day}
      </div>
    </div>
  );
}
