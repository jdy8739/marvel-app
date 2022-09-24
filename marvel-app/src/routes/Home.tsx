import { Helmet } from "react-helmet";
import styles from "./Home.module.css";

function Home() {
    return (
        <div>
            <Helmet>
                <title>Marvel Dictionary</title>
            </Helmet>
            <img
                src="https://37.media.tumblr.com/tumblr_mbha9qWF401qcixnko4_500.gif"
                className={styles.gif}
            />
            <div className={styles.wrapper}>
                <h1 className={styles.marvel}>MARVEL</h1>
                <h3 className={styles.studios}>DICTIONARY</h3>
            </div>
            <p className={styles.sign}>made by Do Young Chung</p>
        </div>
    );
}

export default Home;
