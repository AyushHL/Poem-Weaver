// Animated mesh gradient background with grid overlay
export function Background() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      <div className="bg-mesh__blob bg-mesh__blob--1" />
      <div className="bg-mesh__blob bg-mesh__blob--2" />
      <div className="bg-mesh__blob bg-mesh__blob--3" />
      <div className="bg-mesh__grid" />
      <div className="bg-mesh__noise" />
    </div>
  );
}
