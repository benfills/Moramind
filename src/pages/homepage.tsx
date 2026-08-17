  export default function Homepage() {
    return (
    <div className="dbg1 relative h-dvh w-dvw flex items-start">
      <hgroup className="dbg2 flex flex-col justify-center items-center">
        <h1 className="dbg3 text-5xl md"> Brains Adapt </h1>
        <p className="dbg3 text-sm text-neutral-500"> We just build systems that don't fight yours. </p>
      </hgroup>
      <div className="dbg2 absolute left-65 top-15 translate-y-25">
        this is the mascot
      </div>
      <div className="dbg2 absolute top-45 left-90 h-1/2 w-1/2 flex flex-col justify-center items-center">
        this is the video
      </div>
    </div>
    );
  }
