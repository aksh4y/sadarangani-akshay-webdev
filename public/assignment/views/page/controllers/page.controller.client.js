/**
 * Created by Akshay on 2/15/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("PageNewController", PageNewController)
        .controller("PageEditController", PageEditController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.createPage = createPage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
        console.log(vm.pages);

        function createPage (page) {
            if(page == null || page.name == null || page.name == "" || page.description == null || page.description == ""){
                vm.error = "Please fill all details";
                return;
            }
            var res = PageService.createPage(vm.websiteId, page);
            if(res != null){
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
            vm.error = "An error has occurred.";
        }
    }

    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;
        vm.page = PageService.findPageById(vm.pageId);

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function updatePage (pageId, page) {
            var page = PageService.updatePage(pageId, page);
            if(page == null) {
                vm.error = "Unable to update page";
            } else {
                vm.message = "Page successfully updated"
            }
        }
        function deletePage () {
            PageService.deletePage(vm.pageId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
        }
    }
})();