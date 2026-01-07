<template>
  <div class="qrcode-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">订阅「集智俱乐部」公众号</span>
    </div>

    <!-- QR Code content -->
    <div class="qrcode-content">
      <img 
        src="/swarma-qrcode.jpg" 
        alt="集智俱乐部公众号二维码" 
        class="qrcode-image" 
      />
      <div class="qrcode-info">
        <div class="qrcode-text">
          <p>扫码关注公众号</p>
          <p>获取复杂科学与人工智能前沿进展</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qrcode-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 10px 24px rgba(15, 31, 48, 0.05);
}

/* Header with floating blue bar - inside the card */
.card-header {
  padding: 16px 16px 12px 12px;
  margin-left: 16px;
  margin-top: 16px;
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  bottom: 7px;
  width: 4px;
  background: var(--swarma-primary);
  border-radius: 0px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

/* QR Code content */
.qrcode-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.qrcode-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.qrcode-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qrcode-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qrcode-text p {
  margin: 0;
  font-size: 13px;
  color: #000;
  line-height: 1.5;
  font-weight: 400;
}
</style>

