class Notification{
  show(message, type){
    this.notification = document.createElement('div');
    this.notification.classList.add('notice');
    document.querySelector('body').appendChild(this.notification);
    if (type === 'success'){
      this.notification.classList.add('notice-success');
      `<strong>Success</strong> +${message}`
      this.notification.innerHTML=`<strong>SUCCESS</strong>  ${message}`;
    }else if (type === 'error') {
      this.notification.classList.add('notice-danger');
      this.notification.innerHTML=`<strong>ERROR</strong>  ${message}`;
    }else if (type === 'info') {
      this.notification.classList.add('notice-info');
      this.notification.innerHTML=`<strong>INFO</strong>  ${message}`;
    }
    this.notification.classList.add('active');
    setTimeout(() => {
      this.notification.classList.remove('active');
      this.notification.textContent = '';
      this.notification.remove();
    },6100);
  }
}

