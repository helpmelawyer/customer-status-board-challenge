
import './sidenav.constant';
import './partials/menu-link';
import './partials/menu-toggle';

/* @ngInject */
export default class SidenavController {

  constructor($scope, $rootScope, $mdSidenav, ROOT_SIDENAV_SECTIONS) {
    Object.assign(this, { $scope, $rootScope, $mdSidenav, ROOT_SIDENAV_SECTIONS });

    const _unsubscribe = $scope.$watch(() => $rootScope.isSidenavOpen, (newValue, oldValue) => {
      if (newValue === oldValue) return;

      if (!newValue) {
        this._closeAction(this.componentId);
      } else {
        this._openAction(this.componentId);
      }
    });

    $scope.$on('$destroy', _unsubscribe);


    this.menu = {
      currentPage: null,
      openedSections: [],
      sections: [],

      toggleSelectSection(section) {
        const _sectionIndex = this.openedSections.indexOf(section);

        if (_sectionIndex === -1) {
          this.openedSections.push(section);
        } else {
          this.openedSections.splice(_sectionIndex, 1);
        }
      },

      isSectionSelected(section) {
        return this.openedSections.indexOf(section) !== -1;
      },

      selectPage(page) {
        this.currentPage = page;
      },

      isPageSelected(page) {
        return this.currentPage === page;
      },
    };

    // menu-link, menu-toggle directive에서 사용하는 함수들
    this.isSelected = (page) => {
      return this.menu.isPageSelected(page);
    };

    this.isOpen = (section) => {
      return this.menu.isSectionSelected(section);
    };

    this.toggleOpen = (section) => {
      this.menu.toggleSelectSection(section);
    };

    this.selectPage = (page) => {
      this.menu.selectPage(page);
    };

    this.autoFocusContent = false;

    this.loadSections();
  }

  async loadSections() {

    this.menu.sections = this.ROOT_SIDENAV_SECTIONS.reduce((sections, section) => {

      sections.push(!section.children ? section : Object.assign({}, section, {
        children: section.children.filter(child => {
          if (!child.shouldShowToUser) return true;
          else return false;
        }),
      }));

      return sections;
    }, []);
  }

  async _closeAction(what) {
    this.$rootScope.isAnimating = true;
    await this.$mdSidenav(what).close();
    this.$rootScope.isAnimating = false;
  };

  async _openAction(what) {
    this.$rootScope.isAnimating = true;
    await this.$mdSidenav(what).open();
    this.$rootScope.isAnimating = false;
  };

  async close() {
    this.$rootScope.isSidenavOpen = false;
  }

  async open() {
    this.$rootScope.isSidenavOpen = true;
  }
}

angular.module('HelpmeAdminApp')
.controller('SidenavController', SidenavController);
