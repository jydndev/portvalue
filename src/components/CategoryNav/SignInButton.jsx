import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  IconSVG,
  useAuthActionContext,
  useAuthStateContext,
  useOffCanvasActionContext,
  useOffCanvasStateContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';
import { ExitIcon } from '../Icon/ExitIcon';

const SignInButton = () => {
  const { profile } = useAuthStateContext();
  const { fetchProfile } = useAuthActionContext();
  const { closeCanvas } = useOffCanvasActionContext();
  const { visible } = useOffCanvasStateContext();
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (!isSignedIn()) return;

    (async () => {
      if (!profile) {
        await fetchProfile();
      }

      setUserName(profile?.memberName ? profile.memberName : profile?.memberNo);
    })();
  }, [isSignedIn(), visible, profile]);

  return (
    <div className="category-nav-sign-in">
      <button className="category-nav-sign-in__close" onClick={closeCanvas}>
        <ExitIcon size={32} />
      </button>
    </div>
  );
};

export default SignInButton;
