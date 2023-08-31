import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { IconSVG, useAuthStateContext, usePageScriptsActionContext } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

const SignUpConfirm = () => {
  const { state } = useLocation();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { profile } = useAuthStateContext();

  useLayoutChanger({
    title: '회원가입',
  });

  useEffect(() => {
    applyPageScripts('MEMBER_JOIN_COMPLETE', { profile });
  }, [profile]);

  return (
    <div className="sign-up-confirm">
      <span className="sign-up-confirm__icon-check">
        <IconSVG name="check" strokeWidth={5} stroke="var(--blue-gray-color)" />
      </span>
      <p className="sign-up-confirm__notice-confirm">회원가입이 완료되었습니다.</p>
      <span className="sign-up-confirm__notice-description">
        {state?.memberId ? `${state.memberId}님 ` : ''}회원가입을 축하합니다.
        <br />
      </span>
      <ul className="sign-up-confirm__nav">
        <li className="sign-up-confirm__nav-home">
          <Link to="/">홈으로</Link>
        </li>
        <li className="sign-up-confirm__nav-sign-in">
          <Link to="/sign-in" state={{ ...state }}>
            로그인
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SignUpConfirm;
