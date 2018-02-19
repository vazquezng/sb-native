package com.sbnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.imagepicker.ImagePickerPackage;
import com.yoloci.uploadfile.UploadFilePackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.magus.fblogin.FacebookLoginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new MapsPackage(),
          new RNGoogleSigninPackage(),
          new RNSpinkitPackage(),
          new ReactNativeOneSignalPackage(),
          new ImagePickerPackage(),
          new UploadFilePackage(),
          new TwitterSigninPackage(),
          new VectorIconsPackage(),
          new SplashScreenReactPackage(),
          new FacebookLoginPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index.android";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
