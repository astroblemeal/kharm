import Head from "next/head";
import Header from "../components/Header";
import CreateOrJoin from "../components/CreateOrJoin";
import Feed from "../components/Feed";

export default function Home() {
  return (
    <div className={`page`}>
      <Head>
        <title>Home || Karmic</title>
        <meta name='description' content='Karmic' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />

      <CreateOrJoin />
      <Feed />
    </div>
  );
}
