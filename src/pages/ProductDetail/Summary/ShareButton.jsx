import React, { useState } from 'react';
import { FacebookShareButton, TwitterShareButton, LineShareButton, KakaoShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LineIcon, KakaoIcon } from 'react-share';
import { ShareIcon } from '../../../components/Icon/ShareIcon';

const ShareButton = () => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('링크가 클립보드에 복사되었습니다.');
    });
  };

  return (
    <div className="share-button-container">
      <button
        className="share-icon-button"
        onClick={() => setShowShareOptions(!showShareOptions)}
        aria-label="공유하기"
      >
        <ShareIcon size={24} />
      </button>
      {showShareOptions && (
        <div className="share-options">
          <button onClick={handleCopyLink}>URL 복사</button>
          <FacebookShareButton url={currentUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LineShareButton url={currentUrl}>
            <LineIcon size={32} round />
          </LineShareButton>
        </div>
      )}
    </div>
  );
};

export default ShareButton;