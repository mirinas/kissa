import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/components.css';
export default function HSlider({state, min, max, label = '', step = 1}) {
    const [value, setValue] = state;
    return <div className={'slider-container'}>
        <Slider
            className={'slider'}
            styles={{
                track: {background: 'var(--accent)', height: '0.5em'},
                rail: {height: '0.5em'},
                handle: {height: '1em', width: '1em', background: 'var(--background)',
                    borderColor: 'var(--accent)', opacity: '1'}
            }}
            value={value}
            onChange={setValue}
            step={step} min={min} max={max} />
        <span>{value + label}</span>
    </div>
}