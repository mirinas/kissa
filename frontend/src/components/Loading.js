import '../styles/components.css';

export default function Loading({ className }) {
    return (
        <div className={className}>
            <div className="lds-heart">
                <div/>
            </div>
        </div>
    );
}