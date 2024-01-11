import { Outlet} from "react-router-dom";

export default function JoinLayout() {

    // const [selected, setSelected] = useState('main');
    // const selectedClass = page => selected === page ? 'selected' : '';

    return (
        <>
            <Outlet />
            {/*<div className={'main-pages'}>*/}
            {/*    <main className={'scrollable'}>*/}
            {/*        <Outlet context={{ setSelected }}/>*/}
            {/*    </main>*/}
            {/*    <nav>*/}
            {/*        <Link className={selectedClass('login')} to={'/login'}><LuUser /></Link>*/}
            {/*        <Link className={selectedClass('register')} to={'/app/profile'}><LuUser /></Link>*/}
            {/*    </nav>*/}
            {/*</div>*/}
        </>
    )
}