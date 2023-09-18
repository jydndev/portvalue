import { Checkbox, useClaimActionContext, useClaimStateContext, useModalActionContext } from '@shopby/react-components';

import ProductThumbItem from '../../components/ProductThumbItem';

const ClaimProductTable = () => {
  const { allClaimableOptions, claimSelectStatus } = useClaimStateContext();
  const { toggleOneOrderOption, changeClaimAmount } = useClaimActionContext();
  const { openAlert } = useModalActionContext();

  const handleClaimAmountChange = ({ value, orderOptionNo, pgType }) => {
    if (pgType === 'NAVER_PAY') {
      openAlert({
        message: '네이버페이 주문형 주문은 수량을 나누어 취소/반품할 수 없습니다.\n전체 수량을 선택 후 신청해 주세요.',
      });

      return;
    }

    changeClaimAmount({ [orderOptionNo]: value });
  };

  return (
    <section className="claim__section claim__products">
      {allClaimableOptions.map(
        ({ brandName, productName, optionName, optionValue, price, imageUrl, orderOptionNo, productNo, pgType }) => (
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
              onQuantityChange={(quantity) => handleClaimAmountChange({ quantity, orderOptionNo, pgType })}
            />
          </div>
        )
      )}
    </section>
  );
};

export default ClaimProductTable;
