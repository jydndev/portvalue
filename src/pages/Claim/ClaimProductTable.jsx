import { useTranslation } from 'react-i18next';

import { string } from 'prop-types';

import { Checkbox, useClaimActionContext, useClaimStateContext, useModalActionContext } from '@shopby/react-components';

import ProductThumbItem from '../../components/ProductThumbItem';

const ClaimProductTable = ({ claimTypeLabel }) => {
  const { allClaimableOptions, claimSelectStatus } = useClaimStateContext();
  const { toggleOneOrderOption, changeClaimAmount } = useClaimActionContext();
  const { openAlert } = useModalActionContext();
  const { t } = useTranslation('claim');

  const handleClaimAmountChange = ({ quantity, orderOptionNo, pgType, isQuantityDiscount }) => {
    if (pgType === 'NAVER_PAY') {
      openAlert({
        message: '네이버페이 주문형 주문은 수량을 나누어 취소/반품할 수 없습니다.\n전체 수량을 선택 후 신청해 주세요.',
      });

      return;
    }

    if (isQuantityDiscount) {
      openAlert({
        message: t('canNotChangeWithQuantityDiscount', { claimTypeLabel }),
      });

      return;
    }

    changeClaimAmount({ [orderOptionNo]: quantity });
  };

  return (
    <section className="claim__section claim__products">
      {allClaimableOptions.map(
        ({
          brandName,
          productName,
          optionName,
          optionValue,
          price,
          imageUrl,
          orderOptionNo,
          productNo,
          pgType,
          isQuantityDiscount,
        }) => (
          <div key={orderOptionNo} className="claim__product">
            <Checkbox
              disabled={pgType === 'NAVER_PAY'}
              isRounded={true}
              checked={claimSelectStatus[orderOptionNo]?.isChecked}
              onChange={() => toggleOneOrderOption({ orderOptionNo: orderOptionNo.toString() })}
            />
            <ProductThumbItem
              imageUrl={imageUrl}
              brandName={brandName ?? ''}
              productName={productName}
              productNo={productNo}
              optionName={optionName}
              optionValue={optionValue}
              buyAmt={price.buyAmt}
              usesQuantityChanger={true}
              quantityChangerValue={claimSelectStatus[orderOptionNo]?.claimAmount}
              onQuantityChange={(quantity) =>
                handleClaimAmountChange({ quantity, orderOptionNo, pgType, isQuantityDiscount })
              }
            />
          </div>
        )
      )}
    </section>
  );
};

ClaimProductTable.propTypes = {
  claimTypeLabel: string,
};
export default ClaimProductTable;
