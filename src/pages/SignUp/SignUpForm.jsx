import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useSignUpActionContext,
  useSignUpStateContext,
  TextField,
  useMallStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import SignUpEmailForm from './SignUpEmailForm';
import SignUpSmsForm from './SignUpSmsForm';
import ValidationStatus from './ValidationStatus';

// eslint-disable-next-line complexity
const SignUpForm = () => {
  const {
    verifyUserId,
    verifyUserPassword,
    confirmUserPassword,
    verifyUserName,
    setSignUpMemberInfo,
    setValidationStatus,
    setTimerTime,
    setAuthenticationReSend,
  } = useSignUpActionContext();

  const {
    signUpMemberInfo: { memberId, password, memberName },
    timerTime,
    authenticationsRemainTimeBySeconds,
  } = useSignUpStateContext();

  const { mallJoinConfig } = useMallStateContext();
  const { t } = useTranslation(['form']);

  useEffect(() => {
    if (
      mallJoinConfig.authenticationTimeType !== 'JOIN_TIME' ||
      mallJoinConfig.authenticationType !== AUTHENTICATION_TYPE.SMS_AUTHENTICATION
    ) {
      setValidationStatus((prev) => ({
        ...prev,
        certificatedNumber: { result: true, message: '' },
      }));
    }
  }, [mallJoinConfig]);

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleVerifyUserId = () => verifyUserId();
  const handleVerifyUserPassword = () => verifyUserPassword();
  const handleConfirmUserPassword = () => confirmUserPassword();
  const handleVerifyUserName = () => verifyUserName();

  const startTimer = () => {
    const timeFormat = () => {
      let minute = Math.floor(authenticationsRemainTimeBySeconds / 60).toString();
      let second = (authenticationsRemainTimeBySeconds % 60).toString();

      if (minute.length === 1) minute = `0${minute}`;
      if (second.length === 1) second = `0${second}`;

      setTimerTime({ minute, second });
    };
    timeFormat();
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (Number(timerTime.second) > 0) {
        setTimerTime((prev) => ({
          ...prev,
          second: String(Number(timerTime.second) - 1),
        }));
      }
      if (Number(timerTime.second) === 0) {
        if (Number(timerTime.minute) === 0) {
          clearInterval(timer);
          if (authenticationsRemainTimeBySeconds !== 0) {
            setAuthenticationReSend(true);
            setValidationStatus((prev) => ({
              ...prev,
              certificatedNumber: { result: false, message: '유효시간이 만료되었습니다.' },
            }));
          }
        } else {
          setTimerTime((prev) => ({
            ...prev,
            minute: String(Number(timerTime.minute) - 1),
            second: '59',
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerTime]);
  useEffect(() => {
    if (authenticationsRemainTimeBySeconds === 0) {
      return;
    }
    startTimer();
  }, [authenticationsRemainTimeBySeconds]);

  useEffect(() => {
    if (
      [AUTHENTICATION_TYPE.NOT_USED, AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE].includes(
        mallJoinConfig.authenticationType
      )
    ) {
      setValidationStatus((prev) => ({
        ...prev,
        certificatedNumber: { result: true, message: '' },
      }));
      setSignUpMemberInfo((prev) => ({ ...prev, certificatedNumber: 'NOT_USED' }));
    }
  }, [password]);

  return (
    <>
      <div className="sign-up-form__item">
        <label htmlFor="id" className="sign-up-form__tit">
          {t('id-label')}
        </label>
        <div className="sign-up-form__input-wrap">
          <TextField
            name="memberId"
            id="id"
            value={memberId}
            placeholder={t('id-label')}
            onChange={handleFormValueChange}
            onBlur={() => {
              handleVerifyUserId();
            }}
            minLength={5}
            valid="ENGLISH_NUMBER"
          />
        </div>
        <ValidationStatus name="memberId" />
      </div>
      <div className="sign-up-form__item">
        <label htmlFor="password" className="sign-up-form__tit">
          {t('password-label')}
        </label>
        <div className="sign-up-form__input-wrap">
          <TextField
            name="password"
            id="password"
            placeholder={t('password-placeholder')}
            type="password"
            onChange={handleFormValueChange}
            onBlur={handleVerifyUserPassword}
            minLength={8}
            maxLength={20}
            valid="ENGLISH_NUMBER_SPECIAL"
          />
        </div>
        <ValidationStatus name="password" />
      </div>
      <div className="sign-up-form__item">
        <label htmlFor="passwordCheck" className="sign-up-form__tit">
          {t('passwordCheck-label')}
        </label>
        <div className="sign-up-form__input-wrap">
          <TextField
            name="passwordCheck"
            id="passwordCheck"
            placeholder={t('passwordCheck-label')}
            type="password"
            onChange={handleFormValueChange}
            onBlur={handleConfirmUserPassword}
            minLength={8}
            maxLength={20}
            valid="NO_SPACE"
          />
        </div>
        <ValidationStatus name="passwordCheck" />
      </div>
      <div className="sign-up-form__item">
        <label htmlFor="memberName" className="sign-up-form__tit">
          {t('memberName-label')}
        </label>
        <div className="sign-up-form__input-wrap">
          <TextField
            name="memberName"
            id="memberName"
            value={memberName}
            placeholder={t('memberName-label')}
            onChange={handleFormValueChange}
            onBlur={handleVerifyUserName}
          />
        </div>
        <ValidationStatus name="memberName" />
      </div>
      <SignUpEmailForm />
      <SignUpSmsForm />
    </>
  );
};

export default SignUpForm;
