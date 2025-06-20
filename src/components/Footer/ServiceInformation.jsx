import { useState } from 'react';
import { Link } from 'react-router-dom';

import { array } from 'prop-types';

import { VisibleComponent, useMallStateContext } from '@shopby/react-components';
import { TERMS_HISTORY_KEY_TYPE } from '@shopby/shared/constants';

import TermsDetail from '../TermsDetail';
import { UpIcon } from '../../components/Icon/UpIcon';
import { DownIcon } from '../../components/Icon/DownIcon';

const ServiceInformation = ({ terms }) => {
  const [modalType, setModalType] = useState(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const { termsConfig, serviceBasicInfo, since, businessRegistrationNumberInformation, ...restMall } =
    useMallStateContext();

  const toggleAbout = () => {
    setIsAboutExpanded(!isAboutExpanded);
  };

  return (
    <div>
      <div className="footer__info">
        <div className="footer__company" onClick={toggleAbout}>
          <em>{serviceBasicInfo.companyName} 사업자 정보</em>
          <span className={`footer__toggle-icon${isAboutExpanded ? 'expanded' : ''}`}>
            {isAboutExpanded ? <UpIcon size={16} /> : <DownIcon size={16} />}
          </span>
        </div>
        <div className={`footer__about ${isAboutExpanded ? 'expanded' : ''}`}>
          <VisibleComponent
            shows={serviceBasicInfo.representativeName}
            TruthyComponent={
              <p>
                <span>대표자명 : {serviceBasicInfo.representativeName}</span>
              </p>
            }
          />
          <VisibleComponent
            shows={serviceBasicInfo.address}
            TruthyComponent={
              <p>
                <span>
                  주소 : {serviceBasicInfo.address} {serviceBasicInfo.addressDetail}
                </span>
              </p>
            }
          />
          <p>
            <span>대표번호 : 070-8095-5739</span>
          </p>
          <VisibleComponent
            shows={serviceBasicInfo?.representEmail}
            TruthyComponent={
              <p>
                이메일 : <a href={`mailto:${serviceBasicInfo?.representEmail}`}>{serviceBasicInfo?.representEmail}</a>
              </p>
            }
          />
          {businessRegistrationNumberInformation?.no && (
            <p className="footer__business-registration">
              사업자등록번호 : <span>{businessRegistrationNumberInformation?.no} </span>
              <a href={businessRegistrationNumberInformation?.url}>[사업자정보확인]</a>
            </p>
          )}
          <VisibleComponent
            shows={serviceBasicInfo.onlineMarketingBusinessDeclarationNo}
            TruthyComponent={
              <p>
                <span>통신판매업신고번호 : {serviceBasicInfo.onlineMarketingBusinessDeclarationNo}</span>
              </p>
            }
          />
          <VisibleComponent
            shows={serviceBasicInfo.privacyManagerName}
            TruthyComponent={
              <p>
                <span>개인정보보호책임자 : {serviceBasicInfo.privacyManagerName}</span>
              </p>
            }
          />
          <VisibleComponent
            shows={serviceBasicInfo.companyName}
            TruthyComponent={
              <p className="copyright">
                Copyright &copy; {since} {restMall.companyName} ALL RIGHT RESERVED
              </p>
            }
          />
        </div>
        {/* nav */}
        <nav className="footer__nav">
          {terms.map(({ key, label, content }) => (
            <div key={key}>
              <button
                className={`footer__link footer__link--${key === TERMS_HISTORY_KEY_TYPE.PI_PROCESS ? 'bold' : ''}`}
                onClick={() => setModalType(key)}
              >
                {label}
              </button>
              {modalType === key && (
                <TermsDetail termsKey={key} title={label} onClose={() => setModalType(null)} content={content} />
              )}
            </div>
          ))}
          <Link className="footer__link" to="/customer-center">
            고객센터
          </Link>
        </nav>
        {/* == nav == */}
      </div>

      <div className="footer__extra-logo">
        {termsConfig.fairLogoUsed && <img src={termsConfig.fairLogoUrl} alt="" />}
      </div>
    </div>
  );
};

export default ServiceInformation;

ServiceInformation.propTypes = {
  terms: array,
};
