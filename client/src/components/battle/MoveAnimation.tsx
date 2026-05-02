import './MoveAnimation.css';

export type AnimKind = 'slash' | 'magic' | 'heal' | 'drain' | 'buff' | 'debuff';

interface Props {
  kind: AnimKind;
}

export default function MoveAnimation({ kind }: Props) {
  if (kind === 'slash') {
    return (
      <div className="anim-overlay">
        <div className="slash-line sl-1" />
        <div className="slash-line sl-2" />
        <div className="slash-line sl-3" />
      </div>
    );
  }
  if (kind === 'magic') {
    return (
      <div className="anim-overlay">
        <div className="magic-orb" />
        <div className="magic-ring" />
        <div className="magic-spark sp-1">✦</div>
        <div className="magic-spark sp-2">✦</div>
        <div className="magic-spark sp-3">✦</div>
        <div className="magic-spark sp-4">✦</div>
      </div>
    );
  }
  if (kind === 'heal') {
    return (
      <div className="anim-overlay">
        <div className="heal-plus hp-1">+</div>
        <div className="heal-plus hp-2">+</div>
        <div className="heal-plus hp-3">+</div>
      </div>
    );
  }
  if (kind === 'drain') {
    return (
      <div className="anim-overlay">
        <div className="drain-orb do-1" />
        <div className="drain-orb do-2" />
        <div className="drain-orb do-3" />
        <div className="drain-orb do-4" />
      </div>
    );
  }
  if (kind === 'buff') {
    return (
      <div className="anim-overlay">
        <div className="buff-arrow ba-1">↑</div>
        <div className="buff-arrow ba-2">↑</div>
        <div className="buff-arrow ba-3">↑</div>
      </div>
    );
  }
  if (kind === 'debuff') {
    return (
      <div className="anim-overlay">
        <div className="debuff-arrow da-1">↓</div>
        <div className="debuff-arrow da-2">↓</div>
        <div className="debuff-arrow da-3">↓</div>
      </div>
    );
  }
  return null;
}
