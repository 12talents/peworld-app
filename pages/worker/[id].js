import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { API_URL } from 'helpers/env';
import styles from 'styles/Profile.module.css';
import Header from 'components/atoms/Header';
import PurpleBackground from 'components/atoms/PurpleBackground';
import SocialMedia from 'components/molecules/SocialMedia';
import Portofolio from 'components/molecules/Portofolio';
import WorkExperience from 'components/molecules/WorkExperience';

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;

    const response = await axios.get(`${API_URL}worker/${id}`, {
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    });

    return {
      props: {
        data: response.data.data,
        error: false,
        message: 'Success get data',
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
        error: true,
        message: error.message,
      },
    };
  }
}

const index = ({ data }) => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const token = Cookies.get('token');
  let decoded = '';
  if (token) {
    decoded = jwtDecode(token);
  }

  return (
    <>
      <Header title="Profile Page" />

      <section className={styles.profile}>
        <PurpleBackground className="purple" />

        <div className="container">
          <div className="row">
            <div className={`col-lg-4 col-md-4 col-12 ${styles.profile__user}`}>
              <div className={styles.profile__image}>
                <Image
                  src={`${
                    data.user.photo
                      ? `${API_URL}uploads/worker/${data.user.photo}`
                      : `${API_URL}uploads/worker/default.png`
                  }`}
                  className="rounded-circle"
                  alt={data.user.name}
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.profile__content}>
                <h2>{data.user.name}</h2>
                <h6>{data.user.job_desk}</h6>
              </div>
              <div className={styles.profile__location}>
                <Image src="/icons/icon-location.svg" width={15} height={15} />
                <span>{data.user.domicile}</span>
              </div>
              <p className={styles.profile__type}>{data.user.job_status}</p>
              <p className={styles.profile__description}>
                {data.user.description}
              </p>

              {loading ? (
                <></>
              ) : (
                decoded.role === 1 && (
                  <Link href={`/hire/${data.user.id}`}>
                    <button className={styles.button__main}>Hire</button>
                  </Link>
                )
              )}

              <button className={`${styles.button__secondary} mt-3`}>
                Message
              </button>

              <h2 className={styles.profile__skill}>Skill</h2>

              <div className={`row ${styles.profile__list}`}>
                {data.skill.map((skill) => (
                  <div className="col-auto mb-3">
                    <button>{skill.skill_name}</button>
                  </div>
                ))}
              </div>

              <SocialMedia
                worker
                email={data.login[0].email}
                instagram={data.user.instagram}
                github={data.user.github}
                gitlab={data.user.gitlab}
              />
            </div>

            <div
              className={`col-lg-8 col-md-8 col-12 ${styles.profile__tab}`}
              style={{ width: '54.1vw' }}
            >
              <Tabs
                defaultActiveKey="Portofolio"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Portofolio" title="Portofolio">
                  <Portofolio data={data.portofolio} />
                </Tab>
                <Tab eventKey="WorkExperience" title="Pengalaman Kerja">
                  <WorkExperience data={data.experience} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

index.layout = 'mainLayout';

export default index;
